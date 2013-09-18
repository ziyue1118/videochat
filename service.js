var socket = io.connect("http://localhost:5001");

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var miniVideo = document.getElementById('miniVideo');
var container = document.getElementById('videoContainer');

// var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection
// || window.mozPeerConnection00 || window.mozRTCPeerConnection;
// navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;
// var URL = window.URL || window.webkitURL || window.msURL || window.oURL;
// var IceCandidate = window.IceCandidate || window.mozRTCIceCandidate || window.RTCIceCandidate;
// var SessionDescription = window.SessionDescription || window.mozRTCSessionDescription || window.RTCSessionDescription;
var PeerConnection = null;
var getUserMedia = null;
var webrtcDetectedBrowser = null;

if (navigator.mozGetUserMedia){
	console.log("This is firefox");
	webrtcDetectedBrowser = "firefox";
	PeerConnection = mozRTCPeerConnection;
	SessionDescription = mozRTCSessionDescription;
	IceCandidate = mozRTCIceCandidate;
	getUserMedia = navigator.mozGetUserMedia.bind(navigator);

}
else if (navigator.webkitGetUserMedia) {
	console.log("This is chrome");
	webrtcDetectedBrowser = "chrome";
	PeerConnection = webkitRTCPeerConnection;
	SessionDescription = RTCSessionDescription;
	IceCandidate = RTCIceCandidate;
	getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
}

var isChannelReady; 
var isInitiator;
var isStarted; 
var localStream;
var pc;
var remoteStream;
var turnReady;
var room = 'haha';
var localVideoSource;
var msgStore = [];
// var pc_config = webrtcDetectedBrowser === 'firefox' ? 
// {'iceServers':[{'url':'stun:23.21.150.121'}]} : 
// {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};


//var pcConfig = {'iceServers': [{'url':'stun:23.21.150.121'}]};
var pcConfig = webrtcDetectedBrowser == 'chrome' ? 
{'iceServers': [{'url':"turn:ziyue@192.168.0.20", "credential":"moonlyt"}]}:
{'iceServers': [{"url":"stun:stun.services.mozilla.com"}]};
var pcConstraints = webrtcDetectedBrowser == 'chrome' ?  { 'optional': [{"DtlsSrtpKeyAgreement": true}]} : {"optional":[]};

var sdpConstraints = webrtcDetectedBrowser == 'chrome' ? {'mandatory': {'OfferToReceiveAudio':true, 'OfferToReceiveVideo':true }}: 
{'mandatory': {'OfferToReceiveAudio':true, 'OfferToReceiveVideo':true, 'MozDontOfferDataChannel': true }};
var mediaConstraints = {video: true, audio: true};



//socket.emit('joinroom', room);

socket.on('create', function (){
	console.log("I AM INITIATOR");
	isInitiator = true; 
});

socket.on('add',function (){
	console.log("A PEER JOINED");
	isChannelReady = true;
});

socket.on('destroy', function (){
	console.log("A PEER LEFT");
	isChannelReady = false;
});

socket.on('message',function (message){
	//console.log(message);
	msgStore.push(message);
	if (isStarted || message === 'got user media'){
		processMessage(message); 
	}
});

function processMessage(message) {
	
	if (message === 'got user media') {
		 maybeStart();
	} else 
	if (message.type === 'offer') {
		if (!isInitiator && !isStarted) {
			console.log("not INITIATOR not started");
			maybeStart();
		}
		//message.sdp = message.sdp.replace(/(a=crypto:)(.*?)(\r\n)/g, '');
		pc.setRemoteDescription(new SessionDescription(message));
		doAnswer();

	} else if (message.type === 'answer' && isStarted) {
		//message.sdp = message.sdp.replace(/(a=crypto:)(.*?)(\r\n)/g, '');
		pc.setRemoteDescription(new SessionDescription(message));
	} else if (message.type === 'candidate' && isStarted) {
		var candidate = new IceCandidate({sdpMLineIndex: message.label,
			candidate: message.candidate});
		pc.addIceCandidate(candidate);

	} else if (message.type === 'bye' && isStarted) {
		console.log("goodbye!");
		transitionToStop();
		stop();
		//isInitiator = false;
	}
};

function sendMessage(message) {
	console.log("Sending message: ", message);

	socket.emit('message', message);
}

getUserMedia(mediaConstraints, successCallback, errorCallback);

function successCallback(stream) {
	localStream = stream;
	localVideo.src = URL.createObjectURL(stream);
	console.log(stream);
	localVideoSource = localVideo.src;
	miniVideo.src = localVideo.src;

	localVideo.style.opacity = 1;
    localVideo.style.webkitTransform = 'rotateY(180deg)';
    miniVideo.style.webkitTransform = 'rotateY(180deg)';
    localVideo.style.transform = 'rotateY(180deg)';
    miniVideo.style.transform = 'rotateY(180deg)';
    
    sendMessage('got user media');
	maybeStart(); 


}

function errorCallback(error) {
	console.log('An error occurred: [CODE ' + error.code + ']');
	
}
//An event that fires when a window is about to unload its resources.
// window.onbeforeunload = function(e){
// 	sendMessage({type: 'bye'});

// }


function setLocalOfferAndSendMessage(sessionDescription) {
  // Set Opus as the preferred codec in SDP if Opus is present.
  //sessionDescription.sdp = preferOpus(sessionDescription.sdp);
  console.log(sessionDescription);
  //sessionDescription.sdp = webrtcDetectedBrowser == 'firefox' ? getInteropSDP(sessionDescription.sdp) : sessionDescription.sdp
  pc.setLocalDescription(sessionDescription);
  sendMessage(sessionDescription);
}

function setLocalAnswerAndSendMessage(sessionDescription) {
	console.log(sessionDescription);
	pc.setLocalDescription(sessionDescription);
	sendMessage(sessionDescription);
}

function getInteropSDP(sdp) {
    var inline = 'a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890abc\r\nc=IN';
    sdp = sdp.indexOf('a=crypto') == -1 ? sdp.replace(/c=IN/g, inline) : sdp;

    return sdp;
}

function maybeStart(){
	if (!isStarted && localStream && isChannelReady){
   		console.log("*****MAYBESTART*****");
   		console.log("localstream",localStream);
   		console.log("isStarted", isStarted);
   		console.log("isChannelReady",isChannelReady);
		createPeerConnection(localStream);
   		//pc.addStream(localStream);
		isStarted = true;
        if (isInitiator) {
        	doCall();
        }
		else {
			doCallee();
		}
	}
}

function doCall() {
  //var constraints = {'optional': [], 'mandatory': {}};
  // constraints = mergeConstraints(constraints, sdpConstraints);
  // console.log('Sending offer to peer, with constraints: \n' +
  //   '  \'' + JSON.stringify(constraints) + '\'.');
  console.log("Creating a offer to peer");
  pc.createOffer(setLocalOfferAndSendMessage, null, {});
}

function doCallee() {
    
    while (msgStore.length > 0) {
      console.log("nima");
      processMessage(msgStore.shift());
    }
}

function doAnswer() {
  console.log('Sending answer to peer.');
  pc.createAnswer(setLocalAnswerAndSendMessage, null, {});
}

function createPeerConnection(localStream) {
	console.log("Creating peer connection");
	pc = new PeerConnection(pcConfig, pcConstraints);
	      console.log('Created RTCPeerConnnection with:\n' +
                  '  config: \'' + JSON.stringify(pcConfig) + '\';\n' +
                  '  constraints: \'' + JSON.stringify(pcConstraints) + '\'.');
	pc.onicecandidate = function(event) {
		if (event.candidate) {
			sendMessage({type: "candidate",
						label: event.candidate.sdpMLineIndex, 
						id: event.candidate.sdpMid,
					  	candidate: event.candidate.candidate});
		}
		else {
			console.log("End of candidates");
		}
	}
	
	console.log("Adding local stream...");
	pc.onaddstream = function(event){
		console.log("Add remote stream");
		remoteStream = event.stream;
		remoteVideo.src = URL.createObjectURL(event.stream);
		transitionToActive();

	};
	pc.onremovestream = function(event){
		console.log("Remove remote stream");
	};
	pc.addStream(localStream);

}


// function mergeConstraints(cons1, cons2) {
//   var merged = cons1;
//   for (var name in cons2.mandatory) {
//     merged.mandatory[name] = cons2.mandatory[name];
//   }
//   merged.optional.concat(cons2.optional);
//   return merged;
// }

function stop() {
	  isStarted = false;
	  msgStore = [];
	  pc.close();
	  pc = null;
}

function transitionToActive(){
	    remoteVideo.style.opacity = 1;
	   	setTimeout(function() { 
	    //localVideo.src = '';
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


