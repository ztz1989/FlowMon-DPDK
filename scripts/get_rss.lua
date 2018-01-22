--local mg     = require "moongen"
local memory = require "memory"
local device = require "device"
local stats  = require "stats"
local log    = require "log"
local lm     = require "libmoon"

function configure(parser)
	parser:argument("rxDev", "The device to receive from"):convert(tonumber)
end

function master(args)
	--fp = io.open("tmp.pcap", "w")
	local rxDev = device.config{port = args.rxDev, rxQueues = 2, rssQueues = 2, dropEnable = false, rxDescs=4096}
	device.waitForLinks()
	stats.startStatsTask{rxDevices={rxDev}}
	for i = 1, 2 do
		lm.startTask("dumpSlave", rxDev, rxDev:getRxQueue(i-1))
	end
	lm.waitForTasks()
end

function dumpSlave(rxDev, queue)
	--local fp = io.open("tmp.pcap", "w")
	local bufs = memory.bufArray()
	local pktCtr = stats:newPktRxCounter("Packets counted", "plain")
	--local pktCtr = stats:newDevRxCounter(rxDev, "plain")
	while lm.running() do		
		local rx = queue:tryRecv(bufs, 100)
		for i = 1, rx do
			local buf = bufs[i]
			pktCtr:countPacket(buf)
			print(buf.hash.rss)
		end
		bufs:free(rx)		
		pktCtr:update()
	end
	pktCtr:finalize()
end
