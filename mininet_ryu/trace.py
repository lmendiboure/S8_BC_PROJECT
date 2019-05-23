from pylab import *

fd=open("bw_used.txt","r")

li={}
c={}
for x in fd:
  y=x.split()

  if y != []:
    if int(y[0]) not in li:
      li[int(y[0])]=0
      c[int(y[0])]=0
    li[int(y[0])]=li[int(y[0])]+float(y[1])
    c[int(y[0])]=c[int(y[0])]+1
  

tmp=[li[x]/c[x] for x in li]

plot(tmp)
show()
print tmp
