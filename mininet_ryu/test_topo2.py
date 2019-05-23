#!/usr/bin/python

'Simple idea around Vehicular Ad Hoc Networks - VANETs'

import random

from mininet.node import Controller, RemoteController
from mininet.log import setLogLevel, info
from mn_wifi.cli import CLI_wifi
from mn_wifi.net import Mininet_wifi
from mn_wifi.link import wmediumd, mesh
from mininet.util import waitListening
from mn_wifi.wmediumdConnector import interference


def topology():

    "Create a network."
    net = Mininet_wifi(controller=RemoteController,
                       link=wmediumd,
                       wmediumd_mode=interference)

    info("*** Creating nodes\n")
    cars = []
    for id in range(0, 4):
        min_ = random.randint(1, 4)
        max_ = random.randint(11, 30)
        cars.append(net.addCar('car%s' % (id+1), wlans=1,
                               min_speed=min_,
                               max_speed=max_))
    
    rsus=[]
    rsu11 = net.addAccessPoint('RSU11', ssid='RSU11', mode='g',
                               channel='1')
    rsus.append(rsu11)
    rsu12 = net.addAccessPoint('RSU12', ssid='RSU12', mode='g',
                               channel='2')
    rsus.append(rsu12)
    rsu13 = net.addAccessPoint('RSU13', ssid='RSU13', mode='g',
                               channel='3')
    rsus.append(rsu13)
    rsu14 = net.addAccessPoint('RSU14', ssid='RSU14', mode='g',
                               channel='4')
    rsus.append(rsu14)
    
    rsu15 = net.addAccessPoint('RSU15', ssid='RSU15', mode='g',
                               channel='4')
    rsus.append(rsu15)

    h1=net.addHost('h1')
    h2=net.addHost('h2')
    
    ftp_serv = net.addHost( 'ftp_serv',mac='3a:c8:4d:23:0d:b0' )
    ftp_serv.cmd( '/usr/sbin/vsftpd  &' ) 	
    s1 = net.addSwitch('S1',dpid="1200")

    c1 = net.addController('c1')
   

    info("*** Configuring Propagation Model\n")
    net.setPropagationModel(model="logDistance", exp=4.5)

    info("*** Configuring wifi nodes\n")
    net.configureWifiNodes()

    info("*** Associating and Creating links\n")
    linkopt=dict(bw=1,delay='1ms',loss=0.2)

    net.addLink(rsu11, rsu12,**linkopt)
    net.addLink(rsu12, rsu13,**linkopt)
    net.addLink(rsu13, rsu14,**linkopt)
    net.addLink(rsu14, rsu15,**linkopt)
    net.addLink(rsu11, h1,**linkopt)
    net.addLink(rsu14, h2,**linkopt)
  
    net.addLink(s1, rsu11, **linkopt)
    net.addLink(ftp_serv, s1,**linkopt)

    net.plotGraph(max_x=500, max_y=500)

    net.roads(4)

    net.startMobility(time=0)

    info("*** Starting network\n")
    net.build()
    c1.start()
    rsu11.start([c1])
    rsu12.start([c1])
    rsu13.start([c1])
    rsu14.start([c1])
    s1.start([c1])

    ftp_serv.setIP("10.0.0.250")

    for car in cars:	
	car.cmd('ifconfig %s-wlan0 up'%car)
	car.cmd('ip address add 10.0.0.%d/24 dev %s-wlan0'%((int(cars.index(car))+1),car))
	car.cmd('ip route add 225.0.0.0 dev %s-wlan0'%car)
	car.cmd('ip route add 225.0.0.1 dev %s-wlan0'%car)
	car.cmd('sudo python recv_beacon.py 10.0.0.%d &'%(int(cars.index(car))+1))
        car.cmd('sudo python read_vid.py')
	fd=open("10.0.0.%d"%(int(cars.index(car))+1), "w")
	fd.close()
	car.cmd('./join_group.py 225.0.0.1 10.0.0.%d &'%(int(cars.index(car))+1))
	
   
    for i in range(1,5):
    	rsus[i-1].cmd('sudo python send_beacon.py 02:00:00:00:0%d:00 RSU1%d &'%(i+4,i))

    waitListening(client=ftp_serv,port=21,timeout=5)
    info("*** Running CLI\n")
    CLI_wifi(net)

    info("*** Stopping network\n")
    net.stop()


if __name__ == '__main__':
    setLogLevel('info')
    topology()
