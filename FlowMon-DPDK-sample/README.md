# FlowMon-DPDK
A DPDK software traffic monitor for per-flow statistics. We aim at providing the detailed statistics on both packet level and flow level. Specifically, FlowMon-DPDK aims at providing per-flow throughput, inter-packet gap and percentiles. 

## About the APP: 
  * Adopted version of DPDK: 17.05, expect to be compatible with any DPDK 17+ versions.
  * The program adopts the run-to-completion mode of DPDK.
  * Suggested tunings: disable hyper-threading, use the "performance" CPU frequency governor, disable turbo-boost. For more information, refer to: https://wiki.fd.io/view/VPP/How_To_Optimize_Performance_(System_Tuning)
  
## Usage:
 * Compile with "make", just like any DPDK application.
 * **To execute**: e.g., sudo ./build/FlowMon-DPDK -c 111. 
 
 Option "-c" of EAL command line parameter indicates the set of lcores to be used for the execution of traffic monitor. For example, "111" indicates lcores 0, 4 and 8 are selected. And lcore 0 is used to host the master thread, while lcore 4 and 8 are used to execute the two slave threads. In any case, (total number of selected lcores) = RX_RINGS + 1. 
 * **DPDK-related parameters:** (defined as macros in main.h header file)
   * PORT_ID: The receving port number, which is assigned by DPDK during device binding phase. The default value is 2 in our testbed.
   * BURST_SIZE: The batch size to retrieve packet descriptors from the receiving packet descriptor ring. The default size is 4096.
   * RX_RINGS: The number of RSS queues. The default value is 2.
   * NUM_MBUFS: The number of packet descriptors (namely mbuf in DPDK) in the pre-allocated memory pool. The default value is 8192.
   * MBUF_CACHE_SIZE: The number of packet descriptors in the per-CPU cache. The default value is 256.
   * RX_RING_SIZE: The number of packet descriptors in the RX packet descriptor ring. The default value is 4096, which is the maximum supported value for Intel 82599ES chipset.
   * WRITE_FILE: Write statistics to a "tmp.txt" file. Uncomment it to disable file writing.
  
 * **Software-related parameters:**
   * DOUBLE_HASH, LINKED_LIST and HASH_LIST: three data structures we defined for constructing the flow table. **Only one of them should be enabled**. By default, use HASH_LIST.
   * FLOW_NUM: The number of entries in the flow table. By default, it is 65536 (16 bits long) since we use the lower 16 bits of the RSS hash value (32 bits) to index entries in the flow table, which means the higher 16 bits are used to index specific flows in each entry. This value should always be equal to the power of 2.
   * IPG: namely Inter-Packet Gap. If enabled, per-flow IPG is performed.
   * QUANTILE: Per-flow percentile of IPG. This parameter can be enabled **only if** IPG is enabled, since it calculates the percentile for each IPG.
