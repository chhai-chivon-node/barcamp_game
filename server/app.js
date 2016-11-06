var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');

var hostname = '192.168.0.111';
var port = 3000;

app.listen(port,hostname,function(){ 
	console.log("server runing on port:"+port);
});

io.on('connection', function (socket) { 
  socket.on('countplayer', function (obj) {
    socket.broadcast.emit('countplayer', obj);
	socket.emit('countplayer', obj);
  });
  
  socket.on('move', function (obj) {
	socket.emit('move', obj);
    socket.broadcast.emit('move', obj);
  });
  
  socket.on('win', function (obj) {
    socket.broadcast.emit('win', obj);
  });
  
  socket.on("error", function(err){
    console.log("Caught flash policy server socket error: ");
    console.log(err.stack);
  });
  
});