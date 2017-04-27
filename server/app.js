var app = require('http').createServer();
var io = require('socket.io')(app);

var hostname = '127.0.0.1';
var port = 3000;
var session = {};
app.listen(port,hostname,function(){ 
	console.log("server runing on port:"+port);
});

io.on('connection', function (socket) { 
  if(Object.keys(session).length == 1){
	for(var d in session){
		socket.emit('countplayer', {count:Object.keys(session).length , player:session[d].player});
	}
  }
  socket.on('countplayer', function (obj) {
	session[socket.id] = {player:obj.player};
	
	var returndata = {count:Object.keys(session).length , player:obj.player};
    socket.broadcast.emit('countplayer', returndata);
	socket.emit('countplayer', returndata);
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
  socket.on('disconnect', function () {
		if(session[socket.id]){
			socket.broadcast.emit('leave', {count:Object.keys(session).length , player:session[socket.id].player});
			delete session[socket.id];	
		}
  });
  
});