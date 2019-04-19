#! /usr/bin/env python

import scapy.contrib.igmp
from scapy.all import *

packet=IP(dst=sys.argv[1])/scapy.contrib.igmp.IGMP(type=17)
send(packet,verbose=0)

with open(sys.argv[2], "a") as fd:
  fd.write(sys.argv[1]+'\n')

