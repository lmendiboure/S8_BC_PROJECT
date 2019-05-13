#! /usr/bin/env python

import sys
import json
import requests
import json

#Accounts

#r=requests.get('http://localhost:3001/admin/accounts')
#res=r.json()
#re=res[0]['ip']
#print re

#Right Access for IP addresss

myToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Y2M0NTBlZWE5ZTExNzFhMWVkM2IyN2QiLCJibG9ja0FkZHJlc3MiOiIweDcwMDA3RTFjMjc3NDk1ZTMzMTM2N2JiNmM2MGU0MzlEZTM3QkEzM0YiLCJpYXQiOjE1NTYzNjk4NjcsImV4cCI6MTU1NjM3MzQ2N30.n6Owyd5eu-i9lZO_bGe4WtiB_WveCBg8BtarYJc4e2o'

myUrl = 'http://localhost:3001/users/rightsend'

head = {'Authorization': 'token {}'.format(myToken)}

r1 = requests.get(myUrl, headers=head,data={"ip":sys.argv[1]})

resp = r1.json()

print(resp['right']) #true or false


#bind IP addresss to another one

myUrl1 = 'http://localhost:3001/users/add'

r2=requests.get(myUrl1, headers=head, data={"myip":sys.argv[1],"ipadded":sys.argv[2]})

resp1 = r2.json()

print(resp1['message']) 

