const shell = require("shelljs")
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const fs=require('fs')

const groups = new Map();
groups.set("t2", "225.0.0.1");
groups.set("secu", "225.0.0.1");

app.get('/diffusion/:video/:group', function(req, res){
  console.log(req.params)
  if(req.params.video!='' && req.params.group !=''){
   shell.exec("./send.sh "+ req.params.group+" "+"2500"+" " + req.params.video)
   res.status(200).send()
  }
  else{
  res.status(404).send
 }
 });

app.get('/video/:group_name/:video_name', function(req, res) {
  console.log('lire une vidéo')
  const path = './'+req.params.group_name+'/'+req.params.video_name
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});

app.get('/ftp_upload/:groupe/:nom_video', (req, res) => {
  var PromiseFtp = require('promise-ftp');
  var fs = require('fs');

  var ftp = new PromiseFtp();
  ftp.connect({host: host, user: user, password: password})
  .then(function (serverMessage) {
    return ftp.put("/"+req.params.groupe+"/"+req.params.nom_video, "/"+req.params.groupe+"/"+req.params.nom_video);
  }).then(function () {
    return ftp.end();
  });
});



app.get('/ftp_list', (req, res) => {

  var ftp = new PromiseFtp();
  ftp.connect({host: "10.0.0.250", user: domingo, password: domingo })
    .then(function (serverMessage) {
      console.log('Server message: '+serverMessage);
      return ftp.list('/');
    }).then(function (list) {
      console.log('Directory listing:');
      console.dir(list);
      return ftp.end();
    });
});


app.get('/ftp_download/:groupe/:nom_video', (req, res) => {
  var ftp = new PromiseFtp();
  ftp.connect({host: host, user: user, password: password})
  .then(function (serverMessage) {
    return ftp.get("/"+req.params.groupe+"/"+req.params.nom_video);
  }).then(function (stream) {
    return new Promise(function (resolve, reject) {
      stream.once('close', resolve);
      stream.once('error', reject);
      stream.pipe(fs.createWriteStream("/"+req.params.groupe+"/"+req.params.nom_video));
    });
  }).then(function () {
    return ftp.end();
  });
});

app.get('/local_video_list/:group', function(req, res){
   console.log('liste des vidéos d\'un groupe')
    list_video=shell.exec('ls '+ req.params.group).stdout
     list=list_video.split("\n")	
console.log(list)
  list.pop()
 list_video=list.join(",")	
console.log(list_video)																																																																																																																																																																																																																																																																																																																										
   res.status(200).json({list : list_video})
 
});

server.listen(2900,'127.0.0.1',function(){
 server.close(function(){
   server.listen(2900,process.argv[2],function(){console.log('En attente de requêtes')})
 })
})


