import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom



def createCars(xmlName,baseIPaddr,nbr): #(string, string xxx.xxx.xxx. , int)
    #beginning of XML files
    routes=ET.Element('routes') #routes is ROOT of the tree
    routes.set("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance")
    routes.set("xsi:noNamespaceSchemaLocation","http://sumo.dlr.de/xsd/routes_file.xsd")
    famille1 = ET.SubElement(routes,"vehicles")#son of routes

    i=1
    while i!=nbr:#generate sons of vehicles
        fils=ET.SubElement(famille1,"vehicle")
        fils.set("id",baseIPaddr+str(i))
        fils.set("depart",str(i)+".00")
        fils.set("departLane","best")
        fils.set("departSpeed","max")
        petitfils=ET.SubElement(fils,"route")
        petitfils.set("edges","")
        i=i+1

    mydata=ET.tostring(routes)
    myfile=open(xmlName, "w")

    header ='<?xml version="1.0" encoding="UTF-8"?>'
    s = header + mydata
    old = minidom.parseString(s)
    newXML = old.toprettyxml()
    myfile.write(newXML)
#ENDOFFUNCTION

#createCars("items3.xml","10.0.0.",5)

def addRoutes(myfile,id,routeNumber): #(.xml, string, string)
    tree = ET.parse(myfile)
    root = tree.getroot()
    c=0
    for elem in root[0].findall('vehicle'):
        if elem.get("id") == id:
            elem[0].set("edges",routeNumber)
            tree.write(myfile)
            c=1
    if c==0:
        print("there is no vehicle with id: " + id + " can't add routes")

def setDepartTime(myfile,id,time):
    tree = ET.parse(myfile)
    root = tree.getroot()
    c=0
    for elem in root[0].findall('vehicle'):
        if elem.get("id") == id:
            elem.set("depart", time)
            tree.write(myfile)
            c=1
    if c==0:
        print("there is no vehicle with id: " + id+" can't change depart time")

def setDepartLane(myfile,id,lane):
    tree = ET.parse(myfile)
    root = tree.getroot()
    c=0
    for elem in root[0].findall('vehicle'):
        if elem.get("id") == id:
            elem.set("departLane", lane)
            tree.write(myfile)
            c=1
    if c==0:
        print("there is no vehicle with id: " + id+" can't change depart lane")

def setDepartSpeed(myfile,id,speed):
    tree = ET.parse(myfile)
    root = tree.getroot()
    c=0
    for elem in root[0].findall('vehicle'):
        if elem.get("id") == id:
            elem.set("departSpeed", speed)
            tree.write(myfile)
            c=1
    if c==0:
        print("there is no vehicle with id: " + id+" can't change depart speed")


addRoutes("items3.xml","10.0.4.2","88291 23948")
changeDepart("items3.xml","10.0.0.2","32.99")
