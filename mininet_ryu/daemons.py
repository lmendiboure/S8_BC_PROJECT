#! /usr/bin/env python


import os
import requests
from scapy.all import *

gp={"10.0.0.1":["225.0.0.1"]}

def pkt_callback(pkt):
    if IP in pkt:
        ip_src=pkt[IP].src
        ip_dst=pkt[IP].dst

    if TCP in pkt:
        tcp_dport=pkt[TCP].dport
	if tcp_dport==21:
	    groups=gp[ip_src]
	    #r=requests.get("localhost:3001/users/",data={"ip_client":pkt[IP].src})
	    for element in os.listdir('/home/domingo/groupes'):
	        for gr in groups:
                    if gr==element:
                        os.system("mount --bind /home/domingo/groupes/"+ gr+ " /home/domingo/ftp/"+gr+"/"+pkt[IP].src)
                    else:
			os.system("umount /home/domingo/groupes/"+ gr+ " /home/domingo/ftp/"+gr+"/"+pkt[IP].src)
 

sniff(iface="ftp_serv-eth0", prn=pkt_callback, filter="tcp", store=0)
