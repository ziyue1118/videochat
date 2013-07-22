var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection;

  
if (Peerconnection){
  rtc.createStream({"video": true, "audio": true}, function(stream){
    // get local stream for manipulation
    rtc.attachStream(stream, 'localVideo');
  });
}
  rtc.connect('ws://localhost:5001');

  rtc.on('add remote stream', function(stream, socketId) {
    console.log("ADDING REMOTE STREAM...");
   
    rtc.attachStream(stream, "remoteVideo");
   
  });
  rtc.on('disconnect stream', function(data) {
      console.log('remove ' + data);

  });

  