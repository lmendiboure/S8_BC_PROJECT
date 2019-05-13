import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom
from xml.dom import minidom

def getTypeList(myfile):
    list=[]
    mydoc = minidom.parse(myfile)
    items = mydoc.getElementsByTagName('poi')

    for elem in items:
        if elem.attributes['type'].value not in list:
            list.append(str(elem.attributes['type'].value))
    for l in list:
        print(l)


getTypeList("osm.poly.xml")
