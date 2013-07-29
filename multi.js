var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection
|| window.mozPeerConnection00 || window.mozRTCPeerConnection;
var localVideo  = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var container   = document.getElementById('videoContainer');
var mediaConstraints = {"video": { mandatory: {
      minWidth: 1280,
      minHeight: 720
    }}, "audio": true };


var remoteVideos = [];
var localVideoSource;

function cloneVideo(divId, socketId) {
  var video = document.getElementById(divId);
  var clone = video.cloneNode(false);
  clone.id = "remote" + socketId; 
  document.getElementById('remote').appendChild(clone);
  remoteVideos.push(clone);
  return clone; 

}
function removeVideo(socketId) {
  var video = document.getElementById('remote' + socketId);
  if (video) {
    remoteVideos.splice(remoteVideos.indexOf(video),1);
    video.parentNode.removeChild(video);
  }
  divideVideos();
}
function divideVideos() {
  for (var i = 0, len = remoteVideos.length; i < len; i++) {
    var video = remoteVideos[i];
    setPosition(video, i);
  }
}
function getNum() {
  var len = remoteVideos.length;
  if (len < 4)
    return [len, 1];
  else 
    return [3, 2] ;
}

function setPosition(video, i) {
  var len  = remoteVideos.length;
  var num  = getNum();
  var left = num[0];
  var top  = num[1];
  var col  = i % 3; 
  var row  = Math.floor(i / 3); 
  video.width = 400;
  video.height= 250;
  video.style.position = "absolute";
  var leftMargin =  Math.floor((window.innerWidth - left * video.width) / (left + 1));
  console.log("leftMargin: " + leftMargin);
  var topMargin  =  Math.floor((window.innerHeight - top * video.height) / (top + 1));
  console.log("topMargin: " + topMargin);
  video.style.left = leftMargin * (col + 1) + video.width * col + "px"; 
  console.log("left: " + video.style.left);
  video.style.top  = topMargin * (row + 1) + video.height * row + "px";
}

if (PeerConnection){
    rtc.createStream(mediaConstraints, function(stream){
    // get local stream for manipulation
    rtc.attachStream(stream, 'localVideo');
    localVideoSource = localVideo.src;
    localVideo.style.opacity = 1;
    localVideo.style.webkitTransform = 'rotateY(180deg)';
    localVideo.style.transform =  'rotateY(180deg)';
  });
}

  rtc.connect('ws:'+window.location.href.substring(window.location.protocol.length).split('#')[0]);
  console.log(window.location.href.substring(window.location.protocol.length).split('#')[0]);
  rtc.on('add remote stream', function(stream, socketId) {
    if (remoteVideos.length === 6) {
       alert("Sorry, max number of people is 6!!")
    }
    if (remoteVideos.length < 6) {
      console.log("ADDING REMOTE STREAM...");
      var clone = cloneVideo('remoteVideo', socketId);
      rtc.attachStream(stream, clone.id);
      divideVideos();

      if (stream || remoteVideo.currentTime){
        transitionToActive();
      }
    }


  });

  rtc.on('disconnect stream', function(data) {
      console.log('remove' + data);
   
      removeVideo(data);
      if (remoteVideos.length === 0){
          transitionToStop();
      } 
  });



function transitionToActive() {
    remoteVideo.style.opacity = 1;
    setTimeout(function() { 
    
    localVideo.src = '';
    localVideo.style.opacity = 0;
   // miniVideo.style.opacity = 1; 
  }, 500);

}

function transitionToStop() {
    localVideo.src = localVideoSource;
    localVideo.style.opacity = 1;
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


