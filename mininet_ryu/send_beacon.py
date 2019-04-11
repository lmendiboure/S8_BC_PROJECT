from scapy.all import *


packet=Ether(src=sys.argv[1])/IP(dst='225.0.0.0')/ICMP(type=9)
sendp(packet, loop=1, inter=0.10,iface=sys.argv[2]+'-wlan1',verbose=0)
