#!/usr/bin/python

import subprocess, time, signal

for _ in range(10):
	p = subprocess.Popen(["./build/FlowMon-DPDK", "-c", "112"])
	time.sleep(140)
	p.send_signal(signal.SIGINT)
	time.sleep(6)
