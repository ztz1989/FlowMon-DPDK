#!/usr/bin/python
# The script to test the RX functionality
# Usage: ./test.py port_no
# Wrapper for the following commands:
# sudo ./build/FlowMon-DPDK -l 0,2,4,6,8 -- -P -p 8 --rx="(3,0,2,0)(3,1,4,1)" --tx="(6,0)(8,1)"
# sudo ./build/FlowMon-DPDK --lcores="0,(1,3)@1,(2,4)@2" -c 1F -n 4 -- -P -p 8 --rx="(3,0,1,0)(3,1,2,1)" --tx="(3,0)(4,1)"

import subprocess, time, signal, random, sys

port = int(sys.argv[1])
port_mask = 2**port

for _ in range(50):
	p = subprocess.Popen(["./build/FlowMon-DPDK", "-l", "0,2,4,6,8", "--", "-P", "-p", str(port_mask), '--rx="(' + str(port) + ',0,2,0)(' + str(port) + ',1,4,1)"', '--tx="(6,0)(8,1)"', "--write-file"])

	time.sleep(370)
	p.send_signal(signal.SIGINT)
	time.sleep(6)
