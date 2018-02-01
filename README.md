# FlowMon-DPDK
FlowMon-DPDK is a software traffic monitor with fine-grained statistics:
 a pure DPDK application written in C language, it provides detailed statistics on both packet- and flow-level. 
 
## At a glance
 In a nutshell, FlowMon-DPDK achieves per-flow traffic monitoring at 14.88Mpps (ie 10 Gpbs line rate fully loaded  with minimum size  packets) with negligible packet losses (just a few packets per million) using a minimal amount of CPU resources.
 
To achieve this peformance, we leverage memory aligned double-hash (resolving collision with chaining) and avoid costly operations such as hash functions by leveraging RSS hash computed by the NIC and recently made available in DPDK.

We will be releasing a detailed technical report of FlowMon-DPDK shortly.
 
 
## Capabilities
Specifically, FlowMon-DPDK calculates:
* per-flow size, 
* per-flow throughput and 
* per-flow burstiness (number of packets of other flows in bewteen two packets of the same flow). 

Additionally, it can report:
* simple moments (i.e., average and standard deviation) as well as 
* computing more complex statistics such as per-flow percentiles of the above metrics (with a custom implementation of the PSQuare algorithm).

## Parameters and settings
FlowMon-DPDK follows all the design priciples of DPDK applications. Specifically, we devise three versions according to the DPDK programming models and multi-threading models. 
* The first version is based on the run-to-completion model, its source code can be found inside the run-to-completion/ directory.
* The second version is based on pipeline model, using the traditional POSIX pthread, its source code is located in the pipeline/ directory.
* The third version is also based on pipeline model, but using the novel DPDK L-thread, its source code is inside the cooperative/ directory.

## Compilation instructions 
To compile, just like most of DPDK applications, enter the corresponding directory and type 'make'

## Usage instructions
To commands to run these model are not identical for now.

1, Run-to-completion model:

2, pthread pipeline model:

3, L-thread pipeline model:


More information on usage coming, please hold your breath!
 
