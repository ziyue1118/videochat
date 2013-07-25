var socket = io.connect("planner.moonlyt.com:5001");

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var miniVideo = document.getElementById('miniVideo');
var container = document.getElementById('videoContainer');

var mediaConstraints = {"video": true};
var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection
|| window.mozPeerConnection00 || window.mozRTCPeerConnection;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
var URL = window.URL || window.webkitURL || window.msURL || window.oURL;
var localStream = null;
var remoteVideo = null; 
var pc = null;
var started = false;
var channelReady = false;



navigator.getUserMedia(mediaConstraints, successCallback, errorCallback);


function successCallback(stream) {
	localStream = stream;
	localVideo.src = URL.createObjectURL(stream);
	localVideo.style.opacity = 1;
    miniVideo.src = localVideo.src;
    localVideo.style.webkitTransform = 'rotateY(180deg)';
    miniVideo.style.webkitTransform = 'rotateY(180deg)';
    localVideo.style.transform =  'rotateY(180deg)';
    miniVideo.style.transform = 'rotateY(180deg)';
    //maybeStart(); 
}

function errorCallback(error) {
	console.log('An error occurred: [CODE ' + error.code + ']');
}


function onChannelOpened(evt) {
    channelReady = true;
}
function setLocalAndSendMessage(sessionDescription) {
    pc.setLocalDescription(sessionDescription);
    console.log("Sending: SDP");
    console.log(sessionDescription);
    socket.json.send(sessionDescription);
}



function maybeStart(){
	if (!started && localStream && channelReady){
   		createPeerConnection();

   		started = true;
		pc.createOffer(setLocalAndSendMessage);
	}
}

socket.on('connect', onChannelOpened);
socket.on('message', processSignalingMessage);

function processSignalingMessage(message) {
	

	console.log(message);
	if (message.type === 'offer') {
		if (!started) {
	      createPeerConnection();
	      started = true;
	    }
		pc.setRemoteDescription(new RTCSessionDescription(message));
		pc.createAnswer(setLocalAndSendMessage);
		console.log('offer');

	} else if (message.type === 'answer' && started) {
		pc.setRemoteDescription(new RTCSessionDescription(message));
	} else if (message.type === 'candidate' && started) {
		var candidate = new RTCIceCandidate({sdpMLineIndex: message.label, 
											candidate: message.candidate});
		pc.addIceCandidate(candidate);
		console.log('candidates');
	} else if (message.type === 'bye' && started) {
		transitionToStop();
		pc.close();
		pc = null; 
		started = false;

	}
}

function createPeerConnection() {
	console.log("Creating peer connection");
	var pcConfig = {iceServers:[{url:"stun:stun.l.google.com:19302"}]};
	pc = new PeerConnection(pcConfig);

	pc.onicecandidate = function(event) {
		console.log('hahahahahahahaha');
		if (event.candidate) {
			socket.json.send({type: "candidate",
							  label: event.candidate.sdpMLineIndex, 
							  id: event.candidate.sdpMid,
							  candidate: event.candidate.candidate});
		}
		else {
			console.log("End of candidates");
		}
	}
	
	console.log("Adding local stream...");
	pc.addStream(localStream);
	pc.onaddstream = function(event){
		console.log("Add remote stream");
		remoteVideo.src = URL.createObjectURL(event.stream);
		transitionToActive();

	};
	pc.onremovestream = function(event){
		console.log("Remove remote stream");
	};

}

// function waitForRemoteVideo() {
//     // Call the getVideoTracks method via adapter.js.
//     console.log("i am waiting for the remote stream");
//     videoTracks = remoteStream.getVideoTracks();
//     if (videoTracks.length === 0 || remoteVideo.currentTime > 0) {
//       transitionToActive();
//     } else {
//       setTimeout(waitForRemoteVideo, 100);
//     }
// }

function transitionToActive(){
	    remoteVideo.style.opacity = 1;
	   	setTimeout(function() { 
	    localVideo.src = '';
	    localVideo.style.opacity = 0;
	    miniVideo.style.opacity = 1; }, 500);
}

function transitionToStop(){
		localVideo.src = miniVideo.src;
		localVideo.style.opacity = 1;
		remoteVideo.src = '';
		miniVideo.style.opacity = 0;
		remoteVideo.style.opacity = 0;
}

