#! /usr/bin/env python


from scapy.all import *
import os
import sys
import time
from datetime import datetime

ip=[]
pid=[]
time=[]


def packet_handler():
    if len(ip)>0:
        for ip_dst in ip:
            dex=ip.index(ip_dst)
            if datetime.timestamp(now)-time[dex]>=5 :
                os.system("kill -9 "+pid[dex])
	        ip.remove(ip[dex])
                pid.remove(pid[dex])
                time.remove(time[dex])
    
                
def pkt_callback(pkt) :
    packet_handler();
    if IP in pkt:
        ip_dst=pkt[IP].dst
        if UDP in pkt:
            udp_dport=pkt[UDP].dport
	    if ip_dst in ip:
		dex=ip.index(ip_dst)
		time[dex]=datetime.timestamp(now)
                    
		    
	    else:
                if ip_dst not in os.listdir(sys.argv[2]):
                    os.system('mkdir '+ sys.argv[2]+ip_dst)
	        k=0
                for rep in os.listdir(sys.argv[2]+ip_dst):
                    if rep=="videos"+str(k):
                        k=k+1
	        proc=os.system("ffmpeg -re -i udp://"+ip_dst+":"+str(udp_dport) +" -c:v copy -c:a copy "+sys.argv[2] +ip_dst+"/videos"+str(k)+".mpeg &" )
		ip.append(ip_dst)
		pid.append(proc.pid)
		time.append(datetime.timestamp(now))
         

sniff(iface=sys.argv[1], prn=pkt_callback, filter="udp", store=0) 
