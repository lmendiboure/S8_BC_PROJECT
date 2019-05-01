import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom
from xml.dom import minidom


def setIcons(myfile):
    mydoc = minidom.parse(myfile)
    items = mydoc.getElementsByTagName('poi')
    for elem in items:
        if elem.attributes['type'].value == "amenity.restaurant":
            elem.setAttribute("imgFile","sumoIMG/001-fork.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.toilets":
            elem.setAttribute("imgFile","sumoIMG/003-man.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")

        elif elem.attributes['type'].value == "amenity.theatre":
            elem.setAttribute("imgFile","sumoIMG/002-window.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "shop.tobacco":
            elem.setAttribute("imgFile","sumoIMG/004-pipe.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif (elem.attributes['type'].value == "amenity.bar"):
            elem.setAttribute("imgFile","sumoIMG/005-beer.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif (elem.attributes['type'].value == "amenity.pub"):
            elem.setAttribute("imgFile","sumoIMG/005-beer.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.artwork":
            elem.setAttribute("imgFile","sumoIMG/007-computer-graphic.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.cafe":
            elem.setAttribute("imgFile","sumoIMG/006-coffee-cup.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.bycicle_rental":
            elem.setAttribute("imgFile","sumoIMG/009-bicycle-rental.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.post_box":
            elem.setAttribute("imgFile","sumoIMG/010-mailbox.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.taxi":
            elem.setAttribute("imgFile","sumoIMG/011-frontal-taxi-cab.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "shop.supermarket":
            elem.setAttribute("imgFile","sumoIMG/013-online-store.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.fountain":
            elem.setAttribute("imgFile","sumoIMG/015-fountain.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.parking":
            elem.setAttribute("imgFile","sumoIMG/012-parking.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.school":
            elem.setAttribute("imgFile","sumoIMG/016-university.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.public_building":
            elem.setAttribute("imgFile","sumoIMG/027-school.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.post_office":
            elem.setAttribute("imgFile","sumoIMG/018-architectonic.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.bank":
            elem.setAttribute("imgFile","sumoIMG/019-coin.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "shop.mobile_phone":
            elem.setAttribute("imgFile","sumoIMG/020-smartphone.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "shop.kiosk":
            elem.setAttribute("imgFile","sumoIMG/021-kiosk.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "shop.seafood":
            elem.setAttribute("imgFile","sumoIMG/022-oyster.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "shop.car_repair":
            elem.setAttribute("imgFile","sumoIMG/024-car-repair.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "amenity.bench":
            elem.setAttribute("imgFile","sumoIMG/031-tree-1.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "shop.optician":
            elem.setAttribute("imgFile","sumoIMG/030-eyeglasses.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
        elif elem.attributes['type'].value == "natural.tree":
            elem.setAttribute("imgFile","sumoIMG/031-tree-1.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "shop.jewelry"):
      	    elem.setAttribute("imgFile","sumoIMG/001-diamond.png")
            elem.setAttribute("height","10")
      	    elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "amenity.pharmacy"):
            elem.setAttribute("imgFile","sumoIMG/003-medicine.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "shop.shoes"):      
            elem.setAttribute("imgFile","sumoIMG/004-heels.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "shop.books"):
            elem.setAttribute("imgFile","sumoIMG/books-stack-of-three.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "amenity.library"):
            elem.setAttribute("imgFile","sumoIMG/books-stack-of-three.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "shop.games"):
            elem.setAttribute("imgFile","sumoIMG/005-gamepad.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "shop.hairdresser"):
            elem.setAttribute("imgFile","sumoIMG/comb.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "amenity.nightclub"):
            elem.setAttribute("imgFile","sumoIMG/007-disco-ball.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "shop.wine"):
            elem.setAttribute("imgFile","sumoIMG/006-glass-and-bottle-of-wine.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "amenity.bus_station"):
            elem.setAttribute("imgFile","sumoIMG/008-bus-stop.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "amenity.doctors"):
            elem.setAttribute("imgFile","sumoIMG/stethoscope.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "tourism.hotel"):
            elem.setAttribute("imgFile","sumoIMG/009-hotel-letter-h-sign-inside-a-black-rounded-square.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "shop.florist"):
            elem.setAttribute("imgFile","sumoIMG/010-flower-bouquet.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "shop.estate_agent"):
            elem.setAttribute("imgFile","sumoIMG/011-user.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "shop.clothes"):
            elem.setAttribute("imgFile","sumoIMG/012-costume-clothes.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "shop.department_store;clothes"):
            elem.setAttribute("imgFile","sumoIMG/012-costume-clothes.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "leisure.fitness_centre"):
            elem.setAttribute("imgFile","sumoIMG/013-weightlifting.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "amenity.fast_food"):
            elem.setAttribute("imgFile","sumoIMG/002-hamburger.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "amenity.waste_basket"):
            elem.setAttribute("imgFile","sumoIMG/014-trash-can.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "shop.copyshop"):
            elem.setAttribute("imgFile","sumoIMG/copy-machine.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "amenity.photo_booth"):
            elem.setAttribute("imgFile","sumoIMG/copy-machine.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "histoc.building"):
            elem.setAttribute("imgFile","sumoIMG/015-museum.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "histoc.monument"):
            elem.setAttribute("imgFile","sumoIMG/015-museum.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "histoc.memorial"):
            elem.setAttribute("imgFile","sumoIMG/015-museum.png")
            elem.setAttribute("height","10")
            elem.setAttribute("width","10")
	elif (elem.attributes['type'].value == "RSU"):
            elem.setAttribute("imgFile","sumoIMG/antenna.png")
            elem.setAttribute("height","40")
            elem.setAttribute("width","40")
	    elem.setAttribute("layer","40")
    f=open(myfile,"w")
    mydoc.writexml(f)
    f.close()

setIcons("osm.poly.xml")
