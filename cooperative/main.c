#define _GNU_SOURCE

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <inttypes.h>
#include <sys/types.h>
#include <string.h>
#include <sys/queue.h>
#include <stdarg.h>
#include <errno.h>
#include <getopt.h>
#include <signal.h>

#include <rte_eal.h>
#include <rte_ethdev.h>
#include <rte_cycles.h>
#include <rte_lcore.h>
#include <rte_mbuf.h>
#include <rte_malloc.h>
#include <rte_timer.h>
#include <rte_prefetch.h>
#include <rte_string_fns.h>
#include <rte_log.h>
#include <lthread_api.h>

#define RX_RINGS 2
#define PORT_ID 2

#ifndef __GLIBC__ /* sched_getcpu() is glibc specific */
#define sched_getcpu() rte_lcore_id()
#endif

#define RTE_LOGTYPE_FC RTE_LOGTYPE_USER1

static struct rte_timer timer;
static uint64_t re[RX_RINGS];

#ifdef IPG
static uint64_t global = 0;
#endif

struct rte_eth_rxconf rx_conf;

#define MEMPOOL_CACHE_SIZE 256
#define MAX_PKT_BURST     32
#define BURST_TX_DRAIN_US 100

#define RTE_RX_DESC_DEFAULT 4096

#define BURST_SIZE MAX_PKT_BURST

static uint16_t nb_rxd = RTE_RX_DESC_DEFAULT;

#define NB_MBUF RTE_MAX(\
		(nb_ports*nb_rx_queue*RTE_RX_DESC_DEFAULT +       \
		nb_ports*nb_lcores*MAX_PKT_BURST +                \
		nb_lcores*MEMPOOL_CACHE_SIZE),                    \
		(unsigned)8192)

#define NB_SOCKETS 8

static uint32_t enabled_port_mask;
static int promiscuous_on; /**< Set in promiscuous mode off by default. */
static int numa_on = 1;    /**< NUMA is enabled by default. */

struct rte_eth_rxconf rx_conf;
static const struct rte_eth_conf port_conf = {
        .rxmode = {
                .mq_mode = ETH_MQ_RX_RSS,
                .max_rx_pkt_len = ETHER_MAX_LEN,
                .split_hdr_size = 0,
                .header_split   = 0, /**< Header Split disabled */
                .hw_ip_checksum = 0, /**< IP checksum offload enabled */  //DISABLED!
                .hw_vlan_filter = 0, /**< VLAN filtering disabled */
                .jumbo_frame    = 1, /**< Jumbo Frame Support disabled */ // ENABLED!
                .hw_strip_crc   = 0, /**< CRC stripped by hardware */

        },
        .rx_adv_conf = {
                .rss_conf = {
			.rss_key = NULL,
                        .rss_hf = ETH_RSS_PROTO_MASK,
                }
        },
};

static struct rte_mempool *pktmbuf_pool[NB_SOCKETS];

struct lcore_rx_queue {
	uint8_t port_id;
	uint8_t queue_id;
} __rte_cache_aligned;

#define MAX_RX_QUEUE_PER_LCORE 16
#define MAX_TX_QUEUE_PER_PORT  RTE_MAX_ETHPORTS
#define MAX_RX_QUEUE_PER_PORT  128

#define MAX_LCORE_PARAMS       1024
struct rx_thread_params {
	uint8_t port_id;
	uint8_t queue_id;
	uint8_t lcore_id;
	uint8_t thread_id;
} __rte_cache_aligned;

static struct rx_thread_params rx_thread_params_array[MAX_LCORE_PARAMS];
static struct rx_thread_params rx_thread_params_array_default[] = {
	{0, 0, 2, 0},
	{0, 1, 2, 1},
	{0, 2, 2, 2},
	{1, 0, 2, 3},
	{1, 1, 2, 4},
	{1, 2, 2, 5},
	{2, 0, 2, 6},
	{3, 0, 3, 7},
	{3, 1, 3, 8},
};

static struct rx_thread_params *rx_thread_params = rx_thread_params_array_default;
static uint16_t nb_rx_thread_params = RTE_DIM(rx_thread_params_array_default);

struct tx_thread_params{
	uint8_t lcore_id;
	uint8_t thread_id;
} __rte_cache_aligned;

static struct tx_thread_params tx_thread_params_array[MAX_LCORE_PARAMS];
static struct tx_thread_params tx_thread_params_array_default[] = {
	{4, 0},
	{5, 1},
	{6, 2},
};

static struct tx_thread_params *tx_thread_params =
	tx_thread_params_array_default;
static uint16_t nb_tx_thread_params = RTE_DIM(tx_thread_params_array_default);

#define MAX_RX_QUEUE_PER_THREAD 16
#define MAX_TX_PORT_PER_THREAD  RTE_MAX_ETHPORTS
#define MAX_TX_QUEUE_PER_PORT   RTE_MAX_ETHPORTS
#define MAX_RX_QUEUE_PER_PORT   128

#define MAX_RX_THREAD 1024
#define MAX_TX_THREAD 1024
#define MAX_THREAD    (MAX_RX_THREAD + MAX_TX_THREAD)

/**
 * Producers and consumers threads configuration
 */
static int lthreads_on = 1; /**< Use lthreads for processing*/

rte_atomic16_t rx_counter;  /**< Number of spawned rx threads */
rte_atomic16_t tx_counter;  /**< Number of spawned tx threads */

struct thread_conf {
	uint16_t lcore_id;      /**< Initial lcore for rx thread */
	uint16_t cpu_id;        /**< Cpu id for cpu load stats counter */
	uint16_t thread_id;     /**< Thread ID */
};

struct thread_rx_conf {
	struct thread_conf conf;

	uint16_t n_rx_queue;
	struct lcore_rx_queue rx_queue_list[MAX_RX_QUEUE_PER_LCORE];

	uint16_t n_ring;        /**< Number of output rings */
	struct rte_ring *ring[RTE_MAX_LCORE];
	struct lthread_cond *ready[RTE_MAX_LCORE];

} __rte_cache_aligned;

uint16_t n_rx_thread;
struct thread_rx_conf rx_thread[MAX_RX_THREAD];

struct thread_tx_conf {
	struct thread_conf conf;
	//uint16_t tx_queue_id[RTE_MAX_LCORE];

	struct rte_ring *ring;
	struct lthread_cond **ready;
} __rte_cache_aligned;

uint16_t n_tx_thread;
struct thread_tx_conf tx_thread[MAX_TX_THREAD];

static void timer_cb(__attribute__((unused)) struct rte_timer *tim,
			__attribute__((unused)) void *arg)
{
	uint8_t i;
	double j = 0;
	static double old = 0;

	for(i=0; i<RX_RINGS; i++)
		j += re[i];

	struct rte_eth_stats eth_stats;
	rte_eth_stats_get(PORT_ID, &eth_stats);

	printf("RX rate: %.2lf Mpps, Total RX pkts: %.0lf, Total dropped pkts: %lu\n",
						 (j - old)/1000000, j, eth_stats.imissed);
	old = j;
}

static int
parse_portmask(const char *portmask)
{
	char *end = NULL;
	unsigned long pm;

	/* parse hexadecimal string */
	pm = strtoul(portmask, &end, 16);
	if ((portmask[0] == '\0') || (end == NULL) || (*end != '\0'))
		return -1;

	if (pm == 0)
		return -1;

	return pm;
}

static int
parse_rx_config(const char *q_arg)
{
	char s[256];
	const char *p, *p0 = q_arg;
	char *end;
	enum fieldnames{
		FLD_PORT = 0,
		FLD_QUEUE,
		FLD_LCORE,
		FLD_THREAD,
		_NUM_FLD
	};

	unsigned long int_fld[_NUM_FLD];
	char *str_fld[_NUM_FLD];
	int i;
	unsigned size;

	nb_rx_thread_params = 0;

	while ((p = strchr(p0, '(')) != NULL)
	{
		++p;
		p0 = strchr(p, ')');
		if (p0 == NULL)
			return -1;

		size = p0 - p;
		if (size >= sizeof(s))
			return -1;

		snprintf(s, sizeof(s), "%.*s", size, p);
		if (rte_strsplit(s, sizeof(s), str_fld, _NUM_FLD, ',') != _NUM_FLD)
			return -1;
		for (i = 0; i < _NUM_FLD; i++)
		{
			errno = 0;
			int_fld[i] = strtoul(str_fld[i], &end, 0);
			if (errno != 0 || end == str_fld[i] || int_fld[i] > 255)
				return -1;
		}

		if (nb_rx_thread_params >= MAX_LCORE_PARAMS) {
			printf("exceeded max number of rx params: %hu\n",
					nb_rx_thread_params);
			return -1;
		}

		rx_thread_params_array[nb_rx_thread_params].port_id =
				(uint8_t)int_fld[FLD_PORT];
		rx_thread_params_array[nb_rx_thread_params].queue_id =
				(uint8_t)int_fld[FLD_QUEUE];
		rx_thread_params_array[nb_rx_thread_params].lcore_id =
				(uint8_t)int_fld[FLD_LCORE];
		rx_thread_params_array[nb_rx_thread_params].thread_id =
				(uint8_t)int_fld[FLD_THREAD];
		++nb_rx_thread_params;
		printf("%u %u %u %u\n", (uint8_t)int_fld[FLD_PORT],  (uint8_t)int_fld[FLD_QUEUE],  (uint8_t)int_fld[FLD_LCORE],  (uint8_t)int_fld[FLD_THREAD]);
	}
	rx_thread_params = rx_thread_params_array;
	return 0;
}

static int
parse_tx_config(const char *q_arg)
{
	char s[256];
	const char *p, *p0 = q_arg;
	char *end;
	enum fieldnames {
		FLD_LCORE = 0,
		FLD_THREAD,
		_NUM_FLD
	};
	unsigned long int_fld[_NUM_FLD];
	char *str_fld[_NUM_FLD];
	int i;
	unsigned size;

	nb_tx_thread_params = 0;

	while ((p = strchr(p0, '(')) != NULL)
	{
		++p;
		p0 = strchr(p, ')');
		if (p0 == NULL)
		{
			printf("p0 == NULL\n");
			return -1;
		}

		size = p0 - p;
		if (size >= sizeof(s))
		{
			printf("size >= sizeof(s)\n");
			return -1;
		}

		snprintf(s, sizeof(s), "%.*s", size, p);
		if (rte_strsplit(s, sizeof(s), str_fld, _NUM_FLD, ',') != _NUM_FLD)
		{
			printf("rte_split\n");
			return -1;
		}
		for (i = 0; i < _NUM_FLD; i++)
		{
			errno = 0;
			int_fld[i] = strtoul(str_fld[i], &end, 0);
			if (errno != 0 || end == str_fld[i] || int_fld[i] > 255)
			{
				printf("errno != 0 || end == str_fld[i] || int_fld[i] > 255\n");
				return -1;
			}
		}
		if (nb_tx_thread_params >= MAX_LCORE_PARAMS)
		{
			printf("exceeded max number of tx params: %hu\n",
				nb_tx_thread_params);
			return -1;
		}

		tx_thread_params_array[nb_tx_thread_params].lcore_id =
			(uint8_t)int_fld[FLD_LCORE];
		tx_thread_params_array[nb_tx_thread_params].thread_id =
			(uint8_t)int_fld[FLD_THREAD];
		++nb_tx_thread_params;
	}
	tx_thread_params = tx_thread_params_array;

	return 0;
}

/* display usage */
static void
print_usage(const char *prgname)
{
	printf("%s [EAL options] -- -p PORTMASK -P"
		"  [--rx (port,queue,lcore,thread)[,(port,queue,lcore,thread]]"
		"  [--tx (lcore,thread)[,(lcore,thread]]"
		"  [--enable-jumbo [--max-pkt-len PKTLEN]]\n"
		"  [--parse-ptype]\n\n"
		"  -p PORTMASK: hexadecimal bitmask of ports to configure\n"
		"  -P : enable promiscuous mode\n",
		prgname);
}

#define CMD_LINE_OPT_RX_CONFIG "rx"
#define CMD_LINE_OPT_TX_CONFIG "tx"
#define CMD_LINE_OPT_NO_NUMA "no-numa"
#define CMD_LINE_OPT_ENABLE_JUMBO "enable-jumbo"

/* Parse the argument given in the command line of the application */
static int
parse_args(int argc, char **argv)
{
	int opt, ret;
	char **argvopt;
	int option_index;
	char *prgname = argv[0];

	static struct option lgopts[] = {
		{CMD_LINE_OPT_RX_CONFIG, 1, 0, 0},
		{CMD_LINE_OPT_TX_CONFIG, 1, 0, 0},
		{CMD_LINE_OPT_NO_NUMA, 0, 0, 0},
		{CMD_LINE_OPT_ENABLE_JUMBO, 0, 0, 0},
		{NULL, 0, 0, 0}
	};

	argvopt = argv;

	while ((opt = getopt_long(argc, argvopt, "p:P",
				lgopts, &option_index)) != EOF)
	{
		switch (opt){

		case 'p':
			enabled_port_mask = parse_portmask(optarg);
			if (enabled_port_mask == 0)
			{
				printf("invalid portmask\n");
				print_usage(prgname);
				return EXIT_FAILURE;
			}
			break;
		case 'P':
			printf("Promiscuous mode selected\n");
			promiscuous_on = 1;
			break;
		case 0:
			if (!strncmp(lgopts[option_index].name, CMD_LINE_OPT_RX_CONFIG,
				sizeof(CMD_LINE_OPT_RX_CONFIG))) {
				ret = parse_rx_config(optarg);
				if (ret) {
					printf("invalid rx-config\n");
					print_usage(prgname);
					return -1;
				}
			}

			if (!strncmp(lgopts[option_index].name, CMD_LINE_OPT_TX_CONFIG,
				sizeof(CMD_LINE_OPT_TX_CONFIG)))
			{
				ret = parse_tx_config(optarg);
				if (ret)
				{
					printf("invalid tx-config\n");
					print_usage(prgname);
					return -1;
				}
			}

			if (!strncmp(lgopts[option_index].name, CMD_LINE_OPT_NO_NUMA,
				sizeof(CMD_LINE_OPT_NO_NUMA))) {
				printf("numa is disabled\n");
				numa_on = 0;
			}

			break;
		default:
			print_usage(prgname);
			return EXIT_FAILURE;
		}
	}

	if (optind >= 0)
		argv[optind-1] = prgname;

	ret = optind-1;
	optind = 1; /* reset getopt lib */
	return ret;
}

static int
check_lcore_params(void)
{
	uint8_t queue, lcore;
	uint16_t i;
	int socketid;

	for (i = 0; i < nb_rx_thread_params; ++i)
	{
		queue = rx_thread_params[i].queue_id;
		if (queue >= MAX_RX_QUEUE_PER_PORT)
		{
			printf("invalid queue number: %hhu\n", queue);
			return -1;
		}
		lcore = rx_thread_params[i].lcore_id;
		if (!rte_lcore_is_enabled(lcore))
		{
			printf("error: lcore %hhu is not enabled in lcore mask\n", lcore);
			return -1;
		}
		socketid = rte_lcore_to_socket_id(lcore);
		if ((socketid != 0) && (numa_on == 0))
			printf("warning: lcore %hhu is on socket %d with numa off\n",
				lcore, socketid);
	}
	return 0;
}

static int
init_rx_queues(void)
{
	uint16_t i, nb_rx_queue;
	uint8_t thread;

	n_rx_thread = 0;

	for (i = 0; i < nb_rx_thread_params; ++i)
	{
		thread = rx_thread_params[i].thread_id;
		nb_rx_queue = rx_thread[thread].n_rx_queue;

		if (nb_rx_queue >= MAX_RX_QUEUE_PER_LCORE)
			rte_exit(EXIT_FAILURE, "too many queues (%u) for thread: %u\n",
				(unsigned)nb_rx_queue + 1, (unsigned)thread);

		rx_thread[thread].conf.thread_id = thread;
		rx_thread[thread].conf.lcore_id = rx_thread_params[i].lcore_id;
		rx_thread[thread].rx_queue_list[nb_rx_queue].port_id =
			rx_thread_params[i].port_id;
		rx_thread[thread].rx_queue_list[nb_rx_queue].queue_id =
			rx_thread_params[i].queue_id;
		rx_thread[thread].n_rx_queue++;

		if (thread >= n_rx_thread)
			n_rx_thread = thread + 1;
	}
	return 0;
}

static int
init_tx_threads(void)
{
	int i;

	n_tx_thread = 0;
	for (i = 0; i < nb_tx_thread_params; i++)
	{
		tx_thread[n_tx_thread].conf.thread_id = tx_thread_params[i].thread_id;
		tx_thread[n_tx_thread].conf.lcore_id = tx_thread_params[i].lcore_id;
		n_tx_thread++;
	}
	return 0;
}

static int
init_rx_rings(void)
{
	unsigned socket_io;
	struct thread_rx_conf *rx_conf;
	struct thread_tx_conf *tx_conf;
	unsigned rx_thread_id, tx_thread_id;
	char name[256];
	struct rte_ring *ring = NULL;

	for (tx_thread_id = 0; tx_thread_id < n_tx_thread; tx_thread_id++)
	{
		tx_conf = &tx_thread[tx_thread_id];

		printf("Connecting tx-thread %d with rx-thread %d\n", tx_thread_id,
				tx_conf->conf.thread_id);

		rx_thread_id = tx_conf->conf.thread_id;
		if (rx_thread_id > n_tx_thread)
		{
			printf("connection from tx-thread %u to rx-thread %u fails "
					"(rx-thread not defined)\n", tx_thread_id, rx_thread_id);
			return -1;
		}

		rx_conf = &rx_thread[rx_thread_id];
		socket_io = rte_lcore_to_socket_id(rx_conf->conf.lcore_id);

		snprintf(name, sizeof(name), "app_ring_s%u_rx%u_tx%u",
				socket_io, rx_thread_id, tx_thread_id);

		ring = rte_ring_create(name, 4096*16, socket_io,
				RING_F_SP_ENQ | RING_F_SC_DEQ);

		if (ring == NULL)
			rte_panic("Cannot create ring to connect rx-thread %u "
					"with tx-thread %u\n", rx_thread_id, tx_thread_id);

		rx_conf->ring[rx_conf->n_ring] = ring;

		tx_conf->ring = ring;
		tx_conf->ready = &rx_conf->ready[rx_conf->n_ring];

		rx_conf->n_ring++;
	}
	return 0;
}

static uint8_t
get_port_n_rx_queues(const uint8_t port)
{
	int queue = -1;
	uint16_t i;

	for (i = 0; i < nb_rx_thread_params; ++i)
		if (rx_thread_params[i].port_id == port &&
				rx_thread_params[i].queue_id > queue)
			queue = rx_thread_params[i].queue_id;

	return (uint8_t)(++queue);
}

static int
init_mem(unsigned nb_mbuf)
{
	int socketid;
	unsigned lcore_id;
	char s[64];

	for (lcore_id = 0; lcore_id < RTE_MAX_LCORE; lcore_id++)
	{
		if (rte_lcore_is_enabled(lcore_id) == 0)
			continue;

		if (numa_on)
			socketid = rte_lcore_to_socket_id(lcore_id);
		else
			socketid = 0;

		if (socketid >= NB_SOCKETS)
			rte_exit(EXIT_FAILURE, "Socket %d of lcore %u is out of range %d\n",
				socketid, lcore_id, NB_SOCKETS);

		if (pktmbuf_pool[socketid] == NULL)
		{
			snprintf(s, sizeof(s), "mbuf_pool_%d", socketid);
			pktmbuf_pool[socketid] =
				rte_pktmbuf_pool_create(s, nb_mbuf,
					MEMPOOL_CACHE_SIZE, 0,
					RTE_MBUF_DEFAULT_BUF_SIZE, socketid);
			if (pktmbuf_pool[socketid] == NULL)
				rte_exit(EXIT_FAILURE,
						"Cannot init mbuf pool on socket %d\n", socketid);
			else
				printf("Allocated mbuf pool on socket %d\n", socketid);
		}
	}
	return 0;
}

/*
 * Null processing lthread loop
 *
 * This loop is used to start empty scheduler on lcore.
 */
static void
lthread_null(__rte_unused void *args)
{
	int lcore_id = rte_lcore_id();

	RTE_LOG(INFO, FC, "Starting scheduler on lcore %d.\n", lcore_id);
	lthread_exit(NULL);
}

static void
lthread_rx(void *dummy)
{
	int ret;
	uint32_t nb_rx;
	int i, j;
	uint8_t portid, queueid;
	int worker_id;
	int len[RTE_MAX_LCORE] = { 0 };
	int old_len, new_len;
	struct rte_mbuf *pkts_burst[MAX_PKT_BURST];
	struct thread_rx_conf *rx_conf;

	rx_conf = (struct thread_rx_conf *)dummy;
	lthread_set_data((void *)rx_conf);

	/*
	 * Move this lthread to lcore
	 */
	lthread_set_affinity(rx_conf->conf.lcore_id);

	RTE_LOG(INFO, FC, "Entering main Rx loop on lcore %u\n", rte_lcore_id());

	/*
	 * Init all condition variables (one per rx thread)
	 */
	for (i = 0; i < rx_conf->n_rx_queue; i++)
		lthread_cond_init(NULL, &rx_conf->ready[i], NULL);

	worker_id = 0;

	rx_conf->conf.cpu_id = sched_getcpu();
	rte_atomic16_inc(&rx_counter);

	while (1)
	{
		/*
		 * Read packet from RX queues
		 */
		for (i = 0; i < rx_conf->n_rx_queue; ++i) {
			portid = rx_conf->rx_queue_list[i].port_id;
			queueid = rx_conf->rx_queue_list[i].queue_id;

			nb_rx = rte_eth_rx_burst(portid, queueid, pkts_burst,
				MAX_PKT_BURST);

//			re[queueid] += nb_rx;

			if (nb_rx != 0)
			{
				worker_id = (worker_id + 1) % rx_conf->n_ring;
				old_len = len[worker_id];

				//SET_CPU_BUSY(rx_conf, CPU_PROCESS);
				ret = rte_ring_sp_enqueue_burst(
						rx_conf->ring[worker_id],
						(void **) pkts_burst,
						nb_rx, NULL);

				new_len = old_len + ret;

				if (new_len >= BURST_SIZE) {
					lthread_cond_signal(rx_conf->ready[worker_id]);
					new_len = 0;
				}

				len[worker_id] = new_len;

				if (unlikely(ret < nb_rx)) {
					uint32_t k;

					for (k = ret; k < nb_rx; k++) {
						struct rte_mbuf *m = pkts_burst[k];

						rte_pktmbuf_free(m);
					}
				}
				//SET_CPU_IDLE(rx_conf, CPU_PROCESS);
			}
			lthread_yield();

			for (j = 0; j < nb_rx; j++)
				rte_pktmbuf_free(pkts_burst[j]);
			lthread_yield();
		}
	}
}

/* main processing loop */
static void
lthread_tx_per_ring(void *dummy)
{
	int nb_rx;
	uint8_t portid;
	struct rte_ring *ring;
	struct thread_tx_conf *tx_conf;
	struct rte_mbuf *pkts_burst[MAX_PKT_BURST];
	struct lthread_cond *ready;

	tx_conf = (struct thread_tx_conf *)dummy;
	ring = tx_conf->ring;
	ready = *tx_conf->ready;

	lthread_set_data((void *)tx_conf);

	/*
	 * Move this lthread to lcore
	 */
	lthread_set_affinity(tx_conf->conf.lcore_id);

	RTE_LOG(INFO, FC, "entering main tx loop on lcore %u\n", rte_lcore_id());

	nb_rx = 0;
	rte_atomic16_inc(&tx_counter);
	while (1) {
		/*
		 * Read packet from ring
		 */
		//SET_CPU_BUSY(tx_conf, CPU_POLL);
		nb_rx = rte_ring_sc_dequeue_burst(ring, (void **)pkts_burst,
				MAX_PKT_BURST, NULL);
		//SET_CPU_IDLE(tx_conf, CPU_POLL);
		re[tx_conf->conf.thread_id] += nb_rx;
		if (nb_rx > 0) {
			//SET_CPU_BUSY(tx_conf, CPU_PROCESS);
			//portid = pkts_burst[0]->port;
			//process_burst(pkts_burst, nb_rx, portid);
			//SET_CPU_IDLE(tx_conf, CPU_PROCESS);
			lthread_yield();
		} else
			lthread_cond_wait(ready, 0);
	}
}

static void
lthread_tx(void *args)
{
	struct lthread *lt;

	unsigned lcore_id;
	uint8_t portid;
	struct thread_tx_conf *tx_conf;

	tx_conf = (struct thread_tx_conf *)args;
	lthread_set_data((void *)tx_conf);

	/*
	 * Move this lthread to the selected lcore
	 */
	lthread_set_affinity(tx_conf->conf.lcore_id);

	/*
	 * Spawn tx readers (one per input ring)
	 */
	lthread_create(&lt, tx_conf->conf.lcore_id, lthread_tx_per_ring,
			(void *)tx_conf);

	lcore_id = rte_lcore_id();

	RTE_LOG(INFO, FC, "Entering Tx main loop on lcore %u\n", lcore_id);

	tx_conf->conf.cpu_id = sched_getcpu();
	while (1) {

		lthread_sleep(BURST_TX_DRAIN_US * 1000);

	}
}

static void
lthread_spawner(__rte_unused void *arg)
{
	struct lthread *lt[MAX_THREAD];
	int i, n_thread = 0;

	printf("Entering lthread_spawner\n");

	/*
	 * Create producers (rx threads) on default lcore
	 */

	for (i = 0; i < n_rx_thread; i++) {
		rx_thread[i].conf.thread_id = i;
		lthread_create(&lt[n_thread], -1, lthread_rx,
				(void *)&rx_thread[i]);
		n_thread++;
		printf("Create rx thread %d\n", i);
	}

	/*
	 * Wait for all producers. Until some producers can be started on the same
	 * scheduler as this lthread, yielding is required to let them to run and
	 * prevent deadlock here.
	 */
	while (rte_atomic16_read(&rx_counter) < n_rx_thread)
		lthread_sleep(100000);

	/*
	 * Create consumers (tx threads) on default lcore_id
	 */
	for (i = 0; i < n_tx_thread; i++) {
		tx_thread[i].conf.thread_id = i;
		lthread_create(&lt[n_thread], -1, lthread_tx,
				(void *)&tx_thread[i]);
		n_thread++;
	}

	/*
	 * Wait for all threads finished
	 */
	for (i = 0; i < n_thread; i++)
		lthread_join(lt[i], NULL);
}

/*
 * Start master scheduler with initial lthread spawning rx and tx lthreads
 * (main_lthread_master).
 */
static int
lthread_master_spawner(__rte_unused void *arg) {
	struct lthread *lt;
	int lcore_id = rte_lcore_id();

	//RTE_PER_LCORE(lcore_conf) = &lcore_conf[lcore_id];
	lthread_create(&lt, -1, lthread_spawner, NULL);
	lthread_run();

	return 0;
}

/*
 * Start scheduler on lcore.
 */
static int
sched_spawner(__rte_unused void *arg) {
	struct lthread *lt;
	int lcore_id = rte_lcore_id();

	//RTE_PER_LCORE(lcore_conf) = &lcore_conf[lcore_id];
	lthread_create(&lt, -1, lthread_null, NULL);
	lthread_run();

	return 0;
}

static void handler(int sig)
{
	printf("\nSignal %d received\n", sig);

	struct rte_eth_stats eth_stats;
	rte_eth_stats_get(PORT_ID, &eth_stats);

        printf("\nDPDK: Received pkts %lu \nDropped packets %lu \nErroneous packets %lu\n",
				eth_stats.ipackets + eth_stats.imissed + eth_stats.ierrors,
				eth_stats.imissed, eth_stats.ierrors);

	FILE *fp;
	fp = fopen("tmp.txt", "a");
	fprintf(fp, "%lu %lu %lu %lu\n", eth_stats.ipackets + eth_stats.imissed
				 + eth_stats.ierrors, eth_stats.imissed, re[0], re[1]);
	fclose(fp);
	exit(0);
}

int main(int argc, char **argv)
{
	int ret, i;
	unsigned nb_ports, lcore_id;
	uint16_t queueid;
	uint32_t n_tx_queue, nb_lcores;
	uint8_t portid, nb_rx_queue, queue, socketid;

	signal(SIGINT, handler);

	ret = rte_eal_init(argc, argv);
	if (ret < 0)
		rte_exit(EXIT_FAILURE, "invalid EAL parameters\n");

	argc -= ret;
	argv += ret;

	ret = parse_args(argc, argv);
	if (ret < 0)
		rte_exit(EXIT_FAILURE, "Invalid Flowcount parameters\n");

	if (check_lcore_params() < 0)
		rte_exit(EXIT_FAILURE, "check_lcore_params failed\n");

	ret = init_rx_queues();
	if (ret < 0)
		rte_exit(EXIT_FAILURE, "init_rx_queues failed\n");

	ret = init_tx_threads();
	if (ret < 0)
		rte_exit(EXIT_FAILURE, "init_tx_threads failed\n");

	ret = init_rx_rings();
	if (ret < 0)
		rte_exit(EXIT_FAILURE, "init_rx_rings failed\n");

	nb_ports = rte_eth_dev_count();

	nb_lcores = rte_lcore_count();

	rte_timer_subsystem_init();

	rte_timer_init(&timer);

	uint64_t hz = rte_get_timer_hz();
	lcore_id = rte_lcore_id();
	rte_timer_reset(&timer, hz, PERIODICAL, lcore_id, timer_cb, NULL);

	for (portid = 0; portid < nb_ports; portid++)
	{
		if((enabled_port_mask & (1 << portid)) == 0)
		{
			printf("\nSkipping disabled port %d\n", portid);
			continue;
		}

		/* init port */
		printf("Initializing port %d ... ", portid);
		fflush(stdout);

		nb_rx_queue = get_port_n_rx_queues(portid);
		n_tx_queue = 0; //nb_lcores;
		if (n_tx_queue > MAX_TX_QUEUE_PER_PORT)
			n_tx_queue = MAX_TX_QUEUE_PER_PORT;

		printf("Creating queues: nb_rxq=%d nb_txq=%u... ",
			nb_rx_queue, (unsigned)n_tx_queue);
		ret = rte_eth_dev_configure(portid, nb_rx_queue,
					(uint16_t)n_tx_queue, &port_conf);
		if (ret < 0)
			rte_exit(EXIT_FAILURE, "Cannot configure device: err=%d, port=%d\n",
				ret, portid);

		/* init memory */
		ret = init_mem(NB_MBUF);
		if (ret < 0)
			rte_exit(EXIT_FAILURE, "init_mem failed\n");
	}
	printf("\n");

        rx_conf.rx_thresh.pthresh = 8;
        rx_conf.rx_thresh.hthresh = 8;
        rx_conf.rx_thresh.wthresh = 0;
	rx_conf.rx_free_thresh = 2048;
        rx_conf.rx_drop_en = 0;

	for (i = 0; i < n_rx_thread; i++)
	{
		lcore_id = rx_thread[i].conf.lcore_id;

		if (rte_lcore_is_enabled(lcore_id) == 0)
			rte_exit(EXIT_FAILURE,
					"Cannot start Rx thread on lcore %u: lcore disabled\n",
					lcore_id
				);

		printf("\nInitializing rx queues for RX thread %d on lcore %u ...",
				i, lcore_id);
		fflush(stdout);

		/* Init RX queues*/
		for (queue = 0; queue < rx_thread[i].n_rx_queue; ++queue)
		{
			portid = rx_thread[i].rx_queue_list[queue].port_id;
			queueid = rx_thread[i].rx_queue_list[queue].queue_id;

			if (numa_on)
				socketid = (uint8_t)rte_lcore_to_socket_id(lcore_id);
			else
				socketid = 0;

			printf("rxq=%d,%d,%d ", portid, queueid, socketid);
			fflush(stdout);

			ret = rte_eth_rx_queue_setup(portid, queueid, nb_rxd,
					socketid,
					&rx_conf,
					pktmbuf_pool[socketid]);
			if (ret < 0)
				rte_exit(EXIT_FAILURE, "rte_eth_rx_queue_setup: err=%d,"
						"port=%d\n", ret, portid);
		}
	}

	printf("\n");

	/* start ports */
	for (portid = 0; portid < nb_ports; portid++)
	{
		if ((enabled_port_mask & (1 << portid)) == 0)
			continue;

		ret = rte_eth_dev_start(portid);
		if (ret < 0)
			rte_exit(EXIT_FAILURE, "rte_eth_dev_start: err=%d, port=%d\n",
				ret, portid);

		if (promiscuous_on)
			rte_eth_promiscuous_enable(portid);
	}

	printf("Starting L-Threading Model\n");

	lthread_num_schedulers_set(nb_lcores);
	rte_eal_mp_remote_launch(sched_spawner, NULL, SKIP_MASTER);
	lthread_master_spawner(NULL);

	return 0;
}
