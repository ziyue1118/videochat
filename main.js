var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection;
var localVideo  = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var miniVideo   = document.getElementById('miniVideo');

if (PeerConnection){
    rtc.createStream({"video": true, "audio": true}, function(stream){
    // get local stream for manipulation
    rtc.attachStream(stream, 'localVideo');
    localVideo.style.opacity = 1;
    miniVideo.src = localVideo.src;
    localVideo.style.webkitTransform = 'rotateY(180deg)';
    miniVideo.style.webkitTransform = 'rotateY(180deg)';
  });
}

  rtc.connect('ws:'+window.location.href.substring(window.location.protocol.length).split('#')[0]);

  rtc.on('add remote stream', function(stream, socketId) {
    console.log("ADDING REMOTE STREAM...");
    rtc.attachStream(stream, "remoteVideo");
    if (stream || remoteVideo.currentTime){
      transitionToActive();
    }
  });

  rtc.on('disconnect stream', function(data) {
      transitionToStop();
      console.log('remove ' + data);

  });

function transitionToActive() {
    remoteVideo.style.opacity = 1;
    setTimeout(function() { 
    localVideo.src = '';
    localVideo.style.opacity = 0;
    miniVideo.style.opacity = 1; }, 500);
}

function transitionToStop() {
    localVideo.src = miniVideo.src;
    localVideo.style.opacity = 1;
    //miniVideo.src = '';
    remoteVideo.src = '';
    miniVideo.style.opacity = 0;
    remoteVideo.style.opacity = 0;
  
  }