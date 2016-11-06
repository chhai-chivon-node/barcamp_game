var app = require('http');
var socketServer = require('http').createServer();
var hostname = '192.168.0.111';
var port = 3000;

var server = app.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port,hostname,function(){ 
	console.log("server runing on port:"+port);
});

var io = require('socket.io')(socketServer);
io.on('connection', function (socket) { 
  socket.on('countplayer', function (obj) {
    socket.broadcast.emit('countplayer', obj);
	socket.emit('countplayer', obj);
  });  
});