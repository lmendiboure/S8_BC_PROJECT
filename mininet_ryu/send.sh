if [ "$#" -ne 3 ]; then
    echo "Illegal number of parameters: ./send.sh DEST_IP \"DEST_PORT\" VIDEO_NAME"

else
    ffmpeg -re -stream_loop -1 -i $3 -c:v copy -c:a copy -f mpegts udp://$1:$2
fi

#Avec TCP
#  ffmpeg -re -stream_loop -1 -i <input.mp4> -c:v copy -c:a copy -f mpegts tcp://<son_ip>:<son_port>

