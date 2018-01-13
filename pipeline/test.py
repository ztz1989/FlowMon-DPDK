#!/usr/bin/python
# The script to test the RX functionality
# sudo ./build/FlowCount --lcores="0,(1,3)@1,(2,4)@2" -c 1F -n 4 -- -P -p 4 --rx="(2,0,1,0)(2,1,2,1)" --tx="(3,0)(4,1)"
import subprocess, time, signal, random

for _ in range(50):
	p = subprocess.Popen(["./build/FlowCount", "-c", "1F", "-n", "4", "--", "-P", "-p", "8", '--rx="(2,0,1,0)(2,1,2,1)"', '--tx="(3,0)(4,1)"'])
	time.sleep(370)
	p.send_signal(signal.SIGINT)
	time.sleep(6)
