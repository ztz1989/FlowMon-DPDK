#!/usr/bin/python
# The script to test the RX functionality
# sudo ./build/FlowCount -c 1FF -- -P -p 4 --rx="(2,0,1,0)(2,1,2,1)(2,2,3,2)" --tx="(1,0)(2,1)(3,2)"
# sudo ./build/FlowCount -c f -- -P -p 8 --rx="(3,0,1,0)(3,1,2,1)" --tx="(1,0)(2,1)" --write-file

import subprocess, time, signal, random

for _ in range(50):
	p = subprocess.Popen(["./build/FlowCount", "-c", "7", "-n", "4", "--", "-P", "-p", "8", '--rx="(3,0,1,0)(3,1,2,1)"', '--tx="(1,0)(2,1)"', "--write-file"])
	time.sleep(370)
	p.send_signal(signal.SIGINT)
	time.sleep(6)
