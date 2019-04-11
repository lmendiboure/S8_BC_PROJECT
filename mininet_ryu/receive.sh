

if [ "$#" -ne 2 ]; then
    echo "Illegal number of parameters: ./receive.sh MY_IP \"DEST_PORT\""

else
    ffplay udp://$1:$2
fi

#Avec TCP :
#ffplay tcp://<mon_ip>:<mon_port>?listen
