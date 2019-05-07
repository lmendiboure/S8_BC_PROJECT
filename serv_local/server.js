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
   shell.exec("./send.sh "+groups[req.params.group]+" "+"2500"+" "+req.params.video)
   res.status(200).send()
  }
  else{
  res.status(404).send
 }
 });

app.get('/video', function(req, res) {
  console.log('lire une vidéo')
  const path = 'p2.mp4'
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

server.listen(2900,'127.0.0.1',function(){
 server.close(function(){
   server.listen(2900,process.argv[2],function(){console.log('En attente de requêtes')})
 })
})


