var port = 5001;
var app = require('express')();
var server = require('http').createServer(app);
//var io = require('socket.io').listen(server);
var webRTC = require('webrtc.io').listen(server);

console.log("listening on port " + port);
server.listen(port);



app.get('/', function(req,res){
    res.sendfile(__dirname + '/index.html');
});

app.get('/main.js', function(req,res){
    res.sendfile(__dirname + '/main.js');
});

app.get('/main.css', function(req,res){
    res.sendfile(__dirname + '/main.css');
});

app.get('/webrtc.io.js', function(req,res){
    res.sendfile(__dirname + '/webrtc.io.js');
});


// io.sockets.on('connection', function(socket){
// });

webRTC.rtc.on('connect', function(rtc) {
  //Client connected
  console.log('rtc connect');
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
  console.log('rtc disconnect');
});