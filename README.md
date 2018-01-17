# FlowMon-DPDK
A DPDK software traffic monitor with fine-grained statistics. We aim at providing detailed statistics on both packet- and flow-level. Specifically, FlowMon-DPDK calculates per-flow packets/throughput, burstiness and percentiles. In this repository, we provide the source code of FlowMon-DPDK, which is a pure DPDK application written in C language. As reported from our experiments, FlowMon-DPDK achieves traffic monitoring at 10 Gpbs line rate with negligible packet losses.

## Features of FlowMon-DPDK
As already mentioned, FlowMon-DPDK provides both packet- and flow-level statistics. More details of FlowMon-DPDK can be found in https://www.overleaf.com/read/gpmzbtdmsmyw

## Parameters and settings
FlowMon-DPDK follows all the design priciples of DPDK applications. Specifically, we devise three versions according to the DPDK programming models and multi-threading models. 
* The first version is based on the run-to-completion model, its source code can be found inside the run-to-completion/ directory.
* The second version is based on pipeline model, using the traditional POSIX pthread, its source code is located in the pipeline/ directory.
* The third version is also based on pipeline model, but using the novel DPDK L-thread, its source code is inside the cooperative/ directory.

## Compile and usage
To compile, just like most of DPDK applications, enter the corresponding directory and type 'make'

To commands to run these model are not identical for now.

1, Run-to-completion model:

2, pthread pipeline model:

3, L-thread pipeline model:

