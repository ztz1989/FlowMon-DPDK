#!/usr/bin/python
# The script to test the RX functionality
# Usage: sudo ./build/FlowMon-DPDK -c 112

import subprocess, time, signal, random

for _ in range(5):
	p = subprocess.Popen(["./build/FlowMon-DPDK", "-c", "112"])
	time.sleep(80)
	p.send_signal(signal.SIGINT)
	time.sleep(6)
