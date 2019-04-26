#! /usr/bin/env python

import scapy.contrib.igmp
import os
from scapy.all import *


packet=IP(dst=sys.argv[1])/scapy.contrib.igmp.IGMP(type=17)
send(packet,verbose=0)

try:
  with open(sys.argv[2], "a") as fd:
    fd.write(sys.argv[1]+'\n')
except IOError:
  with open(sys.argv[2], "w") as fd:
    fd.write(sys.argv[1]+'\n')
