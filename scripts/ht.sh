#!/bin/bash

# Be careful to not skip the space at the beginning nor the end
CPUS_TO_SKIP=" $(cat /sys/devices/system/cpu/cpu*/topology/thread_siblings_list | sed 's/[^0-9].*//' | sort | uniq | tr "\r\n" "  ") "

for CPU_PATH in /sys/devices/system/cpu/cpu[0-9]*; do
    if [ "$1" = "disable" ]; then
	 CPU="$(echo $CPU_PATH | tr -cd "0-9")"
    	 echo "$CPUS_TO_SKIP" | grep " $CPU " > /dev/null
   	 if [ $? -ne 0 ]; then
  	      echo 0 > $CPU_PATH/online
  	 fi
    elif [ "$1" = "enable" ]; then
	 echo 1 > $CPU_PATH/online
    fi
done

# to roll back: sudo su;  echo 1 | tee /sys/devices/system/cpu/cpu2[0-9]/online
