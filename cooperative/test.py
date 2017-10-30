#!/usr/bin/python
# The script to test the RX functionality

import subprocess, time, signal, random

for _ in range(50):
	p = subprocess.Popen(["./build/Flowcount", "-c", "1F", "-n", "4", "--", "-P", "-p", "4", '--rx="(2,0,1,0)(2,1,2,1)"', '--tx="(1,0)(2,1)"'])
	time.sleep(370)
	p.send_signal(signal.SIGINT)
	time.sleep(6)
