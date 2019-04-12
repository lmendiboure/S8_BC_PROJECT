from ryu.lib.packet import in_proto
from ryu.base import app_manager
from ryu.controller import mac_to_port
from ryu.controller import ofp_event
from ryu.controller.handler import CONFIG_DISPATCHER, MAIN_DISPATCHER, DEAD_DISPATCHER
from ryu.controller.handler import set_ev_cls
from ryu.ofproto import ofproto_v1_3
from ryu.lib.mac import haddr_to_bin
from ryu.lib.packet import packet
from ryu.lib.packet import ethernet
from ryu.lib.packet import ether_types
from ryu.lib.packet import arp
from ryu.lib.packet import ipv4
from ryu.lib.packet import icmp
from ryu.lib.packet import igmp
from ryu.lib.packet import ipv6
from ryu.lib import mac
from ryu.topology import event, switches
from ryu.topology.api import get_switch, get_link
from ryu.app.wsgi import ControllerBase
from collections import defaultdict
from ryu.lib import hub
from operator import attrgetter
from datetime import datetime
from ryu.ofproto.ofproto_v1_3 import OFPG_ANY
import time

#switches
switches = []
 
#eth_tab[srcmac]->(switch, port)
eth_tab={}

#ip_tab[src_ip]->(mac)
ip_to_mac={}

#group_multicast[mult_addr][dpid]->count
group_multicast=defaultdict(lambda:defaultdict(lambda:None))
 
#adjacency map [sw1][sw2]->port from sw1 to sw2
adjacency=defaultdict(lambda:defaultdict(lambda:None))

datapath_list={}

# bandwith management
byte=defaultdict(lambda:defaultdict(lambda:None))
clock=defaultdict(lambda:defaultdict(lambda:None))
bw_used=defaultdict(lambda:defaultdict(lambda:None))
bw_available=defaultdict(lambda:defaultdict(lambda:None))
bw=defaultdict(lambda:defaultdict(lambda:None))

def max_abw(abw, Q):

  max = float('-Inf')
  node = 0
  for v in Q:
    if abw[v] > max:
      max = abw[v]
      node = v
  return node


def get_path(src,dst,first_port,final_port):
  global bw_available
  print "Dijkstra's widest path algorithm"
  print "src=",src," dst=",dst, " first_port=", first_port, " final_port=", final_port

  #available bandwidth
  abw = {}
  previous = {}
 
  for dpid in switches:
    abw[dpid] = float('-Inf')
    previous[dpid] = None

  abw[src]=float('Inf')
  Q=set(switches)

  print "Q:", Q

  while len(Q)>0:
    u = max_abw(abw, Q)
    Q.remove(u)
    print "Q:", Q, "u:", u

    for p in switches:
      if adjacency[u][p]!=None:
        link_abw = bw_available[str(u)][str(p)]
        print "link_abw:", str(u),"->",str(p),":",link_abw, "kbps"
        if abw[u] < link_abw:
          tmp = abw[u]
        else:
          tmp = link_abw
        if abw[p] > tmp:
          alt = abw[p]
        else:
          alt = tmp
        if alt > abw[p]:
          abw[p] = alt
          previous[p] = u

  r=[]
  p=dst
  r.append(p)
  q=previous[p]

  while q is not None:
    if q == src:
      r.append(q)
      break
    p=q
    r.append(p)
    q=previous[p]
  r.reverse()

  if src==dst:
    path=[src]
  else:
    path=r
 
  r = []
  in_port = first_port
  for s1,s2 in zip(path[:-1],path[1:]):
    out_port = adjacency[s1][s2]
    r.append((s1,in_port,out_port))
    in_port = adjacency[s2][s1]
  r.append((dst,in_port,final_port))
  return r

def get_path_multicast(dpid_src,dpid_dst,first_port,final_port):
  global bw_available
  print "Dijkstra's widest path algorithm"

  #available bandwidth
  abw = {}
  previous = {}
 
  for dpid in switches:
    abw[dpid] = float('-Inf')
    previous[dpid] = None

  abw[dpid_src]=float('Inf')
  Q=set(switches)

  print "Q:", Q

  while len(Q)>0:
    u = max_abw(abw, Q)
    Q.remove(u)
    print "Q:", Q, "u:", u

    for p in switches:
      if adjacency[u][p]!=None:
        link_abw = bw_available[str(u)][str(p)]
        print "link_abw:", str(u),"->",str(p),":",link_abw, "kbps"
        if abw[u] < link_abw:
          tmp = abw[u]
        else:
          tmp = link_abw
        if abw[p] > tmp:
          alt = abw[p]
        else:
          alt = tmp
        if alt > abw[p]:
          abw[p] = alt
          previous[p] = u

  r=[]
  p=dpid_dst
  r.append(p)
  q=previous[p]

  while q is not None:
    if q == dpid_src:
      r.append(q)
      break
    p=q
    r.append(p)
    q=previous[p]
  r.reverse()

  if dpid_src==dpid_dst:
    path=[dpid_src]
  else:
    path=r
 
  r = []
  in_port = first_port
  for s1,s2 in zip(path[:-1],path[1:]):
    out_port = adjacency[s1][s2]
    r.append((s1,in_port,out_port))
    in_port = adjacency[s2][s1]
  r.append((dpid_dst,in_port,final_port))
  return r

 
class ProjectController(app_manager.RyuApp):

    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]

    def __init__(self, *args, **kwargs):
        super(ProjectController, self).__init__(*args, **kwargs)
        self.mac_to_port = {}
        self.topology_api_app = self
        self.datapaths = {}
        self.monitor_thread = hub.spawn(self._monitor)

        global bw

        try:
          fin = open("bw.txt", "r")
          for line in fin:
            a=line.split()
            if a:
              bw[str(a[0])][str(a[1])]=int(a[2])
              bw[str(a[1])][str(a[0])]=int(a[2])
              print a	,bw[str(a[0])][str(a[1])],bw[str(a[1])][str(a[0])]
          fin.close()

        except IOError:
          print "make bw2.txt ready"
       #print "bw:", bw       

    @set_ev_cls(ofp_event.EventOFPStateChange,[MAIN_DISPATCHER, DEAD_DISPATCHER])
    def _state_change_handler(self, ev):
        datapath = ev.datapath
        if ev.state == MAIN_DISPATCHER:
            if not datapath.id in self.datapaths:
                #self.logger.debug('register datapath: %016x', datapath.id)
                #print 'register datapath:', datapath.id
                self.datapaths[datapath.id] = datapath

        elif ev.state == DEAD_DISPATCHER:
            if datapath.id in self.datapaths:
                #self.logger.debug('unregister datapath: %016x', datapath.id)
                #print 'unregister datapath:', datapath.id
                del self.datapaths[datapath.id]

    def _monitor(self):
        while True:
            for dp in self.datapaths.values():
                self._request_stats(dp)
            hub.sleep(3) 

    def _request_stats(self, datapath):
        #self.logger.debug('send stats request: %016x', datapath.id)
        #print 'send stats request:', datapath.id
        ofproto = datapath.ofproto
        parser = datapath.ofproto_parser

 
        req = parser.OFPFlowStatsRequest(datapath)
        datapath.send_msg(req)

        req = parser.OFPPortStatsRequest(datapath, 0, ofproto.OFPP_ANY)
        datapath.send_msg(req)


    @set_ev_cls(ofp_event.EventOFPFlowStatsReply, MAIN_DISPATCHER)
    def _flow_stats_reply_handler(self, ev):
        body = ev.msg.body

        #self.logger.info('datapath         '
        #                 'in-port  eth-dst           '
        #                 'out-port packets  bytes')

        #self.logger.info('---------------- '
        #                 '-------- ----------------- '
        #                 '-------- -------- --------')
        #for stat in sorted([flow for flow in body if flow.priority == 1],
        #                   key=lambda flow: (flow.match['in_port'],
        #                                     flow.match['eth_dst'])):
        #    self.logger.info('%016x %8x %17s %8x %8d %8d',
        #                     ev.msg.datapath.id,
        #                     stat.match['in_port'], stat.match['eth_dst'],
        #                     stat.instructions[0].actions[0].port,
        #                     stat.packet_count, stat.byte_count)


    @set_ev_cls(ofp_event.EventOFPPortStatsReply, MAIN_DISPATCHER)
    def _port_stats_reply_handler(self, ev):
        global byte, clock, bw_used, bw_available
        #print time.time()," _port_stats_reply_handler"
        body = ev.msg.body
        dpid = ev.msg.datapath.id

        for stat in sorted(body, key=attrgetter('port_no')):
          #print dpid, stat.port_no, stat.tx_packets
          for p in switches:
            if adjacency[dpid][p]==stat.port_no:
              #print dpid, p, stat.port_no, bw[str(dpid)][str(p)]

              if byte[dpid][p]>0:
                bw_used[dpid][p] = (stat.tx_bytes - byte[dpid][p]) * 8.0 / (time.time()-clock[dpid][p]) / 1000
                bw_available[str(dpid)][str(p)]=int(bw[str(dpid)][str(p)]) * 1024.0 - bw_used[dpid][p]
                #print str(dpid),"->",str(p),":",bw_available[str(dpid)][str(p)]," kbps"
                #print str(dpid),"->",str(p),":", bw[str(dpid)][str(p)]," kbps"

              byte[dpid][p]=stat.tx_bytes
              clock[dpid][p]=time.time()

        #print "-------------------------------------------------------------------" 

        #self.logger.info('datapath         port     '
        #                 'rx-pkts  rx-bytes rx-error '
        #                 'tx-pkts  tx-bytes tx-error')
        #self.logger.info('---------------- -------- '
        #                 '-------- -------- -------- '
        #                 '-------- -------- --------')
        #for stat in sorted(body, key=attrgetter('port_no')):
        #    self.logger.info('%016x %8x %8d %8d %8d %8d %8d %8d',
        #                     ev.msg.datapath.id, stat.port_no,
        #                     stat.rx_packets, stat.rx_bytes, stat.rx_errors,
        #                     stat.tx_packets, stat.tx_bytes, stat.tx_errors)
 

 
    def add_flow(self, datapath, match, actions ,priority,buffer_id=None , cookie=0 ,idle_timeout=0):
        ofproto = datapath.ofproto
        parser = datapath.ofproto_parser

	inst = [parser.OFPInstructionActions(ofproto.OFPIT_APPLY_ACTIONS, actions)]
        if buffer_id:
            mod = parser.OFPFlowMod(datapath=datapath, buffer_id=buffer_id,priority=priority, match=match,instructions=inst,cookie=cookie,idle_timeout=idle_timeout, command=ofproto.OFPFC_ADD)
        else:
            mod = parser.OFPFlowMod(datapath=datapath, priority=priority, buffer_id=ofproto.OFP_NO_BUFFER, match=match, instructions=inst, cookie=cookie, idle_timeout=idle_timeout,command=ofproto.OFPFC_ADD)

        #mod = parser.OFPFlowMod(datapath=datapath, match=match, cookie=cookie,command=ofproto.OFPFC_ADD,priority=ofproto.OFP_DEFAULT_PRIORITY, instructions=inst)
        datapath.send_msg(mod)

    def install_path(self, p, ev,dst_mac,buff_id):
       print "install_path is called"
       #print "p=", p, " src_mac=", src_mac, " dst_mac=", dst_mac
       msg = ev.msg
       datapath = msg.datapath
       dpid=datapath.id
       ofproto = datapath.ofproto
       parser = datapath.ofproto_parser

       for sw, in_port, out_port in p:
         print "->", dst_mac, "via ", sw, " in_port=", in_port, " out_port=", out_port
         match=parser.OFPMatch(eth_dst=dst_mac,in_port=in_port)
         actions=[parser.OFPActionOutput(out_port)]
         datapath=datapath_list[sw]
	 if dpid==sw:
           self.add_flow(datapath=datapath, match=match,actions=actions,priority=1,buffer_id=buff_id)
	 else:
	   self.add_flow(datapath=datapath, match=match,actions=actions,priority=1)


    @set_ev_cls(ofp_event.EventOFPSwitchFeatures , CONFIG_DISPATCHER)
    def switch_features_handler(self , ev):
        print "switch_features_handler is called"
        datapath = ev.msg.datapath
        ofproto = datapath.ofproto
        parser = datapath.ofproto_parser
        match = parser.OFPMatch()
        actions = [parser.OFPActionOutput(ofproto.OFPP_CONTROLLER,ofproto.OFPCML_NO_BUFFER)]
        #inst = [parser.OFPInstructionActions(ofproto.OFPIT_APPLY_ACTIONS , actions)]
        #mod = datapath.ofproto_parser.OFPFlowMod(datapath=datapath, match=match, cookie=0,command=ofproto.OFPFC_ADD, idle_timeout=0, hard_timeout=0,priority=0, instructions=inst)
	self.add_flow(datapath,match,actions,0)
        #datapath.send_msg(mod)

 

    def del_flow(self,datapath,match):
	#print "Deleting flows"
	#print "Match,dpid",match,datapath.id
        ofproto = datapath.ofproto
        parser = datapath.ofproto_parser

        mod = parser.OFPFlowMod(datapath=datapath, match=match,command=ofproto.OFPFC_DELETE, out_port=ofproto.OFPP_ANY, out_group=ofproto.OFPG_ANY, buffer_id=ofproto.OFP_NO_BUFFER, cookie=0, priority=0)
        datapath.send_msg(mod)

    def handle_arp(self, datapath, port, pkt_ethernet, pkt_arp,buff_id):
        print "Handle arp"
	target_eth=ip_to_mac[pkt_arp.dst_ip]
        pkt = packet.Packet()
        pkt.add_protocol(ethernet.ethernet(ethertype=pkt_ethernet.ethertype, dst=pkt_ethernet.src, src=target_eth))
        pkt.add_protocol(arp.arp(opcode=arp.ARP_REPLY, src_mac=target_eth, src_ip=pkt_arp.dst_ip, dst_mac=pkt_arp.src_mac, dst_ip=pkt_arp.src_ip))
        
	print "reply (src,dst):",target_eth,pkt_arp.dst_ip,pkt_ethernet.src,pkt_arp.src_ip, eth_tab[pkt_ethernet.src][1]
        pkt.serialize()
        data = pkt.data
        actions = [datapath.ofproto_parser.OFPActionOutput(port)]
        out = datapath.ofproto_parser.OFPPacketOut(datapath=datapath,buffer_id=buff_id,in_port=datapath.ofproto.OFPP_CONTROLLER,actions=actions, data=data)
        datapath.send_msg(out)
	print ""
	
    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def _packet_in_handler(self, ev):
         msg = ev.msg
         datapath = msg.datapath
         ofproto = datapath.ofproto
         parser = datapath.ofproto_parser
         in_port = msg.match['in_port']
         pkt = packet.Packet(msg.data)
         eth = pkt.get_protocol(ethernet.ethernet)
         
         dst = eth.dst
         src = eth.src
         dpid = datapath.id
	 
	 #ignore LLDP broadcasts
         if eth.ethertype == ether_types.ETH_TYPE_LLDP:
            return
	
  	 #drop IPV6 packets
         if pkt.get_protocol(ipv6.ipv6):
            match = parser.OFPMatch(eth_type=eth.ethertype)
            actions = []
            self.add_flow(datapath,match, actions,1)
	    return 
	 
	 #answer arp requests
	 if eth.ethertype==ether_types.ETH_TYPE_ARP:
	    pkt_arp=pkt.get_protocol(arp.arp)
	    if pkt_arp.opcode == arp.ARP_REQUEST:
	      self.handle_arp(datapath,in_port,eth,pkt_arp,msg.buffer_id)
	      return 	
	 
	 #if ipv4
	 if eth.ethertype == 0x0800:
	    ip=pkt[1]
	    
	    #add unknown mac address
            if src not in eth_tab.keys():
               eth_tab[src]=(dpid,  in_port)
	       ip_to_mac[ip.src]=src
	    #print dst,src,eth_tab[src][0],dpid,in_port

	    if ip.proto==0x01 and (pkt[2].type==0 or pkt[2].type==8) :
	       print "PING, src :",src,"dest : ",dst
	    
	    #car have changed of RSU, need to update flow table
	    if ip.proto == 0x01 and pkt[2].type == 10 : #ICMPv4 router sollicitation
	       print src,"change de RSU, prev :",eth_tab[src][0],"new",dpid
	       eth_tab[src]=(dpid,in_port)
	       for sw in switches:
	         datapath_tmp=datapath_list[sw]
	         for link in links:
	           match=parser.OFPMatch(eth_dst=src,in_port=link[2])
	       	   self.del_flow(datapath_tmp,match)
		 match=parser.OFPMatch(eth_dst=src,in_port=1)#port wlan1
		 self.del_flow(datapath_tmp,match)
	       print " "  
               return

	    #IGMP membership query
	    if ip.proto == 0x02 and pkt[2].msgtype == 0x11:
	       print src,"joined ",pkt[1].dst,"group"
	       if (pkt[2].address in group_multicast) and (dpid in group_multicast[pkt[2].address]):
	         group_multicast[pkt[2].address][dpid]+=1
	       elif (pkt[2].address in group_multicast) and (dpid not in group_multicast[pkt[2].address]):
	         group_multicast[pkt[2].address][dpid]=1
	       print group_multicast
	       return 

	    #IGMP leave group
	    if ip.proto == 0x02 and pkt[2].msgtype == 0x17:
	       print src,"left ",pkt[1].dst,"group"
	       if (pkt[2].address in group_multicast) and (dpid in group_multicast[pkt[2].address]):
		 if group_multicast[pkt[2].address][dpid]>0:
	           group_multicast[pkt[2].address][dpid]-=1
	       print group_multicast
   	       return 

            if self.isMulticast(ip.dst):
               self.sendMulticast(msg)

         #print "var : ",src,dst,in_port
 	 #print src, "envoie a" , dst, "type",hex(eth.ethertype)

	 #djikstra algorithm
         if dst in eth_tab.keys(): 
	    print src,"--->", dst   
            p = get_path(eth_tab[src][0], eth_tab[dst][0], eth_tab[src][1], eth_tab[dst][1])
            print "Path=", p
            self.install_path(p, ev,dst,msg.buffer_id)
            out_port = p[0][2]
  	 else:
            out_port=ofproto.OFPP_FLOOD

         data = None
         if msg.buffer_id == ofproto.OFP_NO_BUFFER:
            data = msg.data
         
         #print src, "---->",dst,"; type :",eth.ethertype
         actions = [parser.OFPActionOutput(out_port)]
         out = parser.OFPPacketOut(datapath=datapath,buffer_id=msg.buffer_id,in_port=in_port,actions=actions, data=data)
         datapath.send_msg(out)

    def isMulticast(self, dst):
         return ( dst[0:2] == '01' or dst[0:5] == '33:33')

    def sendMulticast(self,msg):
	 msg = ev.msg
         datapath = msg.datapath
         ofproto = datapath.ofproto
         parser = datapath.ofproto_parser
         in_port = msg.match['in_port']
         pkt = packet.Packet(msg.data)
         eth = pkt.get_protocol(ethernet.ethernet)
         
         dst = eth.dst
         src = eth.src
         dpid = datapath.id
	 ip=pkt[1]
	 paths=[]
	
	 for dpid_tmp in group_multicast[ip.src]:
            paths.append(get_path_multicast(dpid,dpid_tmp,in_port,1))

	 buckets=defaultdict(lambda:defaultdict(lambda:list))

	 for path in paths:
	   for sw, in_port, out_port in path:
	     bucket_action = [parser.OFPActionOutput(out_port)]
             buckets[sw][in_port].append(parser.OFPBucket(weight=0,watch_port=0,watch_group=ofproto.OFPG_ANY,actions=bucket_action))
	     print buckets
	 
	 for key in buckets:
	     for key2 in buckets[key]:
	       group_id=random.randint(0, 2**32)
	       req = ofp_parser.OFPGroupMod(datapath, ofproto.OFPGC_ADD, ofproto.OFPGT_ALL,group_id,buckets[key][key2])
	       datapath_list[sw].send_msg[req]
	       actions = [ofp_parser.OFPActionGroup(group_id)]
	       match=parser.OFPMatch(eth_dst=dst_mac,in_port=key[1])
	       self.add_flow(datapath_list[key[0]],match, actions,0)



	    
    events=[event.EventSwitchEnter,event.EventSwitchLeave, event.EventPortAdd,event.EventPortDelete, event.EventPortModify,event.EventLinkAdd, event.EventLinkDelete]
    @set_ev_cls(events)
    def get_topology_data(self, ev):
         #print "get_topology_data() is called"
         global switches, adjacency, datapath_list,links
         switch_list = get_switch(self.topology_api_app, None)
         switches=[switch.dp.id for switch in switch_list]

         for switch in switch_list:
            datapath_list[switch.dp.id]=switch.dp

         #print "datapath_list=", datapath_list
         #print "switches=", switches
         links_list = get_link(self.topology_api_app, None)
         #print "links_list=", links_list
         links=[(link.src.dpid,link.dst.dpid,link.src.port_no,link.dst.port_no) for link in links_list]

         for s1,s2,port1,port2 in links:
            #print "type(s1)=", type(s1), " type(port1)=", type(port1)
            adjacency[s1][s2]=port1
            adjacency[s2][s1]=port2
            #print s1,":", port1, "<--->",s2,":",port2


