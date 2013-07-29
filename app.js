var port = process.env.PORT || 5001;
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

app.get('/service.js', function(req, res){
    res.sendfile(__dirname + '/service.js');
});

app.get('/adapter.js', function(req, res){
    res.sendfile(__dirname + '/adapter.js');
});

app.get('/multi.js', function(req, res){
    res.sendfile(__dirname + '/multi.js');
});
// io.sockets.on('connection', function(socket){

//     socket.on('message', function(message) {
//         console.log('Received Message, broadcasting: ' + message);
//         socket.broadcast.emit('message', message);
//     });
//     socket.on('disconnect', function() {
    
//         console.log("socket disconnected.");
     
//     });
// });

webRTC.rtc.on('connect', function(rtc) {
  //Client connected
  console.log('rtc connect');
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
  console.log('rtc disconnect');
});