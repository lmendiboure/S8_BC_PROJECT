#!/usr/bin/env python

from scapy.all import *
import scapy.contrib.igmp                    

prev_rsu=""
tmp=0
def PacketHandler(packet) :
	global prev_rsu
	global tmp
        if packet[0][1].type == 9: #ICMP router advertisement
            if prev_rsu != packet[0].src:
                prev_rsu=packet[0].src
                #print("Access Point MAC: %s" %(packet[0].src))
	        packet=IP(dst='225.0.0.0')/ICMP(type=10)
	        send(packet,verbose=0)
  
                try:
                  with open(sys.argv[1], "r") as fd:
                    mygroups=fd.read()

		    groups=mygroups.split('\n')
		    #print groups
		    for address in groups:
		      #print address
		      packet=IP(dst=address)/scapy.contrib.igmp.IGMP(type=17)
	              send(packet,verbose=0)
		      if tmp==1:
		        packet=IP(dst=address)/scapy.contrib.igmp.IGMP(type=23)
	                send(packet,verbose=0)
                   
	        except IOError:
		  #print 'error'
		  pass
	        tmp=1

sniff(lfilter = lambda x: x.haslayer(ICMP),prn = PacketHandler,count=0,store=0)
