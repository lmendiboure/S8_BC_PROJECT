#! /usr/bin/env python


from scapy.all import *

packet=IP(dst=sys.argv[1])/ICMP(type=23)
send(packet,verbose=0)
