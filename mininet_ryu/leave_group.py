#! /usr/bin/env python

import scapy.contrib.igmp
from scapy.all import *

packet=IP(dst=sys.argv[1])/scapy.contrib.igmp.IGMP(type=23)
send(packet,verbose=0)

with open(sys.argv[2], "r") as fd:
  mygroups=fd.read()

groups=mygroups.split('\n')
groups.remove(sys.argv[1])

with open(sys.argv[2], "w") as fd:
  fd.write()

with open(sys.argv[2], "a") as fd:
  for address in groups:
    fd.write(address+'\n')
  
