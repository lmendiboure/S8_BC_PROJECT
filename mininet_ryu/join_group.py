#! /usr/bin/env python


from scapy.all import *

packet=IP(dst=sys.argv[1])/ICMP(type=17)
send(packet,verbose=0)

