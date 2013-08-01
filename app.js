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

io.sockets.on('connection', function(socket){

   console.log("server connected");
  
   socket.on('message', function(message) {
        socket.broadcast.emit('message', message);
   });
   socket.on('joinroom', function(room){
      var numOfClients = io.sockets.clients(room).length;
      console.log("Number: " + numOfClients);
      if (numOfClients === 0) {
        socket.join(room);
        socket.emit('create', room);
      } else {
        io.sockets.in(room).emit('add', room);
        socket.join(room);
        socket.emit('add', room);
      }


   });
  
});

