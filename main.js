var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection
|| window.mozPeerConnection00 || window.mozRTCPeerConnection;
var localVideo  = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var miniVideo   = document.getElementById('miniVideo');
var container   = document.getElementById('videoContainer');
var mediaConstraints = {"video": true};
// var socket = io.connect("http://localhost:5001");

if (PeerConnection){
    rtc.createStream(mediaConstraints, function(stream){
    // get local stream for manipulation
    rtc.attachStream(stream, 'localVideo');
    localVideo.style.opacity = 1;
    miniVideo.src = localVideo.src;
    localVideo.style.webkitTransform = 'rotateY(180deg)';
    miniVideo.style.webkitTransform = 'rotateY(180deg)';
    localVideo.style.transform =  'rotateY(180deg)';
    miniVideo.style.transform = 'rotateY(180deg)';
  });
}

  rtc.connect('ws:'+window.location.href.substring(window.location.protocol.length).split('#')[0]);
  console.log(window.location.href.substring(window.location.protocol.length).split('#')[0]);
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
 // container.addEventListener('dblclick', enterFullScreen);
//localVideo.addEventListener('loadedmetadata', function(){resize();});


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

function enterFullScreen() {
   container.webkitRequestFullScreen();
}


function resize(){
    var aspectRatio;
    if (remoteVideo.style.opacity === '1') {
      aspectRatio = remoteVideo.videoWidth/remoteVideo.videoHeight;
    } else if (localVideo.style.opacity === '1') {
      aspectRatio = localVideo.videoWidth/localVideo.videoHeight;
    } else {
      return;
    }

    var innerHeight = this.innerHeight;
    var innerWidth = this.innerWidth;
    var videoWidth = innerWidth < aspectRatio * window.innerHeight ?
    innerWidth : aspectRatio * window.innerHeight;
    var videoHeight = innerHeight < window.innerWidth / aspectRatio ?
    innerHeight : window.innerWidth / aspectRatio;
    containerDiv = document.getElementById('videoContainer');
    containerDiv.style.width = videoWidth + 'px';
    containerDiv.style.height = videoHeight + 'px';
    containerDiv.style.left = (innerWidth - videoWidth) / 2 + 'px';
    containerDiv.style.top = (innerHeight - videoHeight) / 2 + 'px';
};


