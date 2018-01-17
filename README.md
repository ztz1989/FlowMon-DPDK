# FlowMon-DPDK
A DPDK software traffic monitor with fine-grained statistics. We aim at providing detailed statistics on both packet- and flow-level. Specifically, FlowMon-DPDK calculates per-flow packets/throughput, burstiness and percentiles. In this repository, we provide the source code of FlowMon-DPDK, which is a pure DPDK application written in C language. 

## Parameters and settings
FlowMon-DPDK follows all the design priciples of DPDK applications. Specifically, we devise three versions according to the DPDK programming models and multi-threading models. 
* The first version is based on the run-to-completion model
* The second version is based on pipeline model, using the traditional POSIX pthread.
* The third version is also based on pipeline model, but using the novel DPDK L-thread.
