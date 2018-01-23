--local mg     = require "moongen"
local memory = require "memory"
local device = require "device"
local stats  = require "stats"
local log    = require "log"
local lm     = require "libmoon"

local ft = {}
local FLOW_NUM = 65536

for i = 1, FLOW_NUM do
	ft[i-1] = 0
end

function configure(parser)
	parser:argument("rxDev", "The device to receive from"):convert(tonumber)
end

function master(args)
	local rxDev = device.config{port = args.rxDev, rxQueues = 2, rssQueues = 2, dropEnable = false, rxDescs=4096}
	device.waitForLinks()
	stats.startStatsTask{rxDevices={rxDev}}
	for i = 1, 2 do
		lm.startTask("dumpSlave", rxDev, rxDev:getRxQueue(i-1))
	end
	lm.waitForTasks()
end

function dumpSlave(rxDev, queue)
	local bufs = memory.bufArray()
	local pktCtr = stats:newPktRxCounter("Packets counted", "plain")
	
	while lm.running() do		
		local rx = queue:tryRecv(bufs, 100)
		for i = 1, rx do
			local buf = bufs[i]
			pktCtr:countPacket(buf)
			index = bit.band(buf.hash.rss, 0xFFFF)
			ft[index] = ft[index] + 1
		end

		bufs:free(rx)		
		pktCtr:update()
	end

	pktCtr:finalize()

        for i = 1, 100 do
		if ft[i-1] ~= 0 then
        		print(i .. ' ' .. ft[i-1])
		end
        end
end
