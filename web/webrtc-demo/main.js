'use strict';

function logError(err) {
  console.error(err);
}

// "Signalling Server" 

var callbacks = {};

function register(userId, callback) {
  callbacks[userId] = callback;
}

function send(to, msg) {
  callbacks[to](msg);
}

// Parent

var pcs = {};
var parentVideo = document.getElementById('parentVideo');
var parentStream = null;

function createStreamIfNeeded() {
  if (parentStream) {
    return;
  }

  if (parentVideo.captureStream) {
    parentStream = parentVideo.captureStream();
  } else if (parentVideo.mozCaptureStream) {
    parentStream = parentVideo.mozCaptureStream();
  } else {
    console.log('captureStream() not supported');
    return;
  }
}

function initClientConnection(clientId) {
  console.log('creating parent side pc for client', clientId);
  var pc = new RTCPeerConnection({});
  pcs[clientId] = pc;
  pc.addStream(parentStream);

  pc.onicecandidate = function(evt) {
    if (evt.candidate) {
      console.log('parent sending ICE candidate to client', clientId);
      send(clientId, JSON.stringify({
        type: 'icecandidate',
        data: evt.candidate
      }));
    } 
  };
}

function setAndSendParentDesc(clientId) {
  var pc = pcs[clientId];
  pc.createAnswer()
    .then(function(desc) {
      send(clientId, JSON.stringify({ type: 'desc', data: desc }));
      pc.setLocalDescription(desc)
        .then(function() {
          console.log('parent set its local desc for client', clientId);
        })
        .catch(logError);
    })
    .catch(logError);
}

function receiveFromClient(msg) {
  msg = JSON.parse(msg);

  var clientId = msg.clientId;
  if (pcs[clientId] === undefined) {
    initClientConnection(clientId);
  }

  switch (msg.type) {
    case 'desc':
      var desc = new RTCSessionDescription(msg.data);
      pcs[clientId].setRemoteDescription(desc)
        .then(function() {
          console.log('parent set its remote desc for client', clientId);
          setAndSendParentDesc(clientId);
        })
        .catch(logError);
      break;
    case 'icecandidate':
      var iceCandidate = new RTCIceCandidate(msg.data);
      pcs[clientId].addIceCandidate(iceCandidate)
        .then(function() {
          console.log('parent added ICE candidate from client', clientId);
        })
        .catch(logError);
      break;
    default:
      console.warn('parent received invalid msg type', msg.type);
  }
}

register('parent', receiveFromClient);

parentVideo.oncanplay = createStreamIfNeeded;
// Handle case where video starts before the event handler gets registered
if (parentVideo.readyState >= 3) {
  createStreamIfNeeded();
}

parentVideo.play();

// Clients

var clientCount = 0;
var clients = [];

var Client = function(clientId) {
  var pc = new RTCPeerConnection({});

  pc.onaddstream = function(evt) {
    console.log('client', clientId, 'received remote stream');
    var video = document.getElementById('video' + clientId);
    video.srcObject = evt.stream;
  };

  pc.onicecandidate = function(evt) {
    if (evt.candidate) {
      console.log('client', clientId, 'sending ICE candidate to parent');
      send('parent', JSON.stringify({
        type: 'icecandidate',
        clientId: clientId,
        data: evt.candidate
      }));
    }
  };

  var setLocalDesc = function(desc) {
    pc.setLocalDescription(desc)
      .then(function() {
        send('parent', JSON.stringify({
          type: 'desc',
          clientId: clientId,
          data: desc
        }));
        console.log('client', clientId, 'set local description');
      })
      .catch(logError);
  };

  var setRemoteDescription = function(desc) {
    pc.setRemoteDescription(desc) 
      .then(function() {
        console.log('client', clientId, 'set remote description');
      })
      .catch(logError);
  };

  this.createOffer = function() {
    pc.createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 1 })
      .then(setLocalDesc)
      .catch(logError);
  };

  this.receiveMsg = function(msg) {
    msg = JSON.parse(msg);
    switch (msg.type) {
      case 'desc':
        var desc = new RTCSessionDescription(msg.data); 
        setRemoteDescription(desc);
        break;
      case 'icecandidate': 
        var iceCandidate = new RTCIceCandidate(msg.data); 
        pc.addIceCandidate(iceCandidate)
          .then(function() {
            console.log('client', clientId, 'added ICE candidate');
          })
          .catch(logError);
        break;
      default:
        console.warn('client received invalid message type', msg.type);
    }
  };

  register(clientId, this.receiveMsg);
}

function connectNewClient() {
  console.log('new client connecting');
  var clientId = clientCount++;
  addVideoElement(clientId);
  var client = new Client(clientId);
  clients.push(client);
  client.createOffer();
}

function addVideoElement(videoId) {
  var elt = document.createElement('video');
  elt.id = 'video' + videoId;
  elt.autoplay = elt.controls = true;
  var container = document.getElementById('video-container');  
  container.appendChild(elt);
}
