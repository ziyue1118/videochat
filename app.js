var port = process.env.PORT || 5001;
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


console.log("listening on port " + port);
server.listen(port);


app.get('/', function(req,res){
    res.sendfile(__dirname + '/index.html');
});

app.get('/service.css', function(req,res){
    res.sendfile(__dirname + '/service.css');
});

app.get('/service.js', function(req, res){
    res.sendfile(__dirname + '/service.js');
});

var rooms = {}

// returns the count of users in the room
var joinRoom = function(roomId) {
  rooms[roomId] = rooms[roomId] || 0;
  rooms[roomId]++;
  return rooms[roomId];
}

var leaveRoom = function(roomId) {
  rooms[roomId] = rooms[roomId] || 0;
  if (rooms[roomId] > 0) {
    rooms[roomId]--;
  }
  return rooms[roomId];
}

io.sockets.on('connection', function(socket){

    var roomId = "haha";
    
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('add');
    
    // if they are the first user
    if (joinRoom(roomId) === 1) {
      socket.emit('create');
    }
    else {
      socket.emit('add');
    }
    socket.on('disconnect', function() {
      if (leaveRoom(roomId) === 1) {
        socket.broadcast.to(roomId).emit('create'); // this guy is the initiator now
        socket.broadcast.to(roomId).emit('destroy');// try to destroy the channel 
        socket.broadcast.to(roomId).emit('message', {type: 'bye'});// set the peervideo to local stream
      }
    })

    socket.on('message', function(message) {
        socket.broadcast.to(roomId).emit('message', message);
    });
   
  
});

