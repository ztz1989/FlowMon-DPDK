#!/usr/bin/python
# The script to test MoonGen RX functionality

import subprocess, time, signal, random, sys

if sys.argv[1] == "flow":
	script = "flow-level.lua"
elif sys.argv[1] == "packet":
	script = "packet-level.lua"
else:
	print "invalid argument"
	sys.exit(0)

for _ in range(10):
	p = subprocess.Popen(["/home/tzhang/MoonGen/build/MoonGen", script, "2"])
	time.sleep(140)
	p.send_signal(signal.SIGINT)
	time.sleep(6)
