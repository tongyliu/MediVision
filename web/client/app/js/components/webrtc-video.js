/*
 * webrtc-video.js
 *
 * Video components backed by WebRTC
 */

var React = require('react');
var io = require('socket.io-client');
var _ = require('lodash');
var config = require('../config.js');

var socket = io.connect(config.SOCKET_URL);

function logError(err) {
  console.error(err);
}

var ParentVideo = React.createClass({
  render: function() {
    var vidProps = _.pick(this.props, ['id', 'height', 'width']);
    return (
      <video {...vidProps} ref="video" className="video-js" controls loop>
        <source src={this.props.src} type="video/mp4"/>
        <p className="vjs-no-js">Unsupported Browser</p>
      </video>
    );
  },

  componentDidMount: function() {
    this.peerConnections = {};
    socket.on(this.props.id, this._receiveFromClient);

    // We need to add a slight timeout before getting the stream to ensure that
    // the DOM is fully ready
    var delay = 300;
    setTimeout(function() {
      this.refs.video.oncanplay = this._createStreamIfNeeded();
      // Handle case where video starts before the handler is registered
      if (this.refs.video.readyState >= 3) {
        this._createStreamIfNeeded();
      }
      this.refs.video.play();
    }.bind(this), delay);
  },

  _createStreamIfNeeded: function() {
    if (!this.stream) {
      if (this.refs.video.captureStream) {
        this.stream = this.refs.video.captureStream();
      } else if (this.refs.video.mozCaptureStream) {
        this.stream = this.refs.video.mozCaptureStream();
      } else {
        console.warn('captureStream() not supported');
      }
    }
  },

  _receiveFromClient: function(msg) {
    var clientId = msg.clientId;
    if (this.peerConnections[clientId] === undefined) {
      this._initClientConnection(clientId);
    }

    switch (msg.type) {
      case 'desc':
        this._setRemoteDescription(clientId, msg.data);
        break;
      case 'icecandidate':
        this._addIceCandidate(clientId, msg.data);
        break;
      default:
        console.warn('invalid message type', msg.type);
        break;
    }
  },

  _initClientConnection: function(clientId) {
    var pc = new RTCPeerConnection({});
    this.peerConnections[clientId] = pc;
    pc.addStream(this.stream);
    // Register event handler to send ICE candidates to the client
    pc.onicecandidate = function(evt) {
      if (evt.candidate) {
        socket.emit('send', {
          to: [this.props.id, clientId].join(),
          type: 'icecandidate',
          data: evt.candidate
        });
      }
    }.bind(this);
  },

  _setRemoteDescription: function(clientId, descStr) {
    var desc = new RTCSessionDescription(descStr);
    this.peerConnections[clientId].setRemoteDescription(desc)
      .then(this._createAndSendAnswer.bind(this, clientId))
      .catch(logError);
  },

  _createAndSendAnswer: function(clientId) {
    var pc = this.peerConnections[clientId];
    pc.createAnswer()
      .then(function(desc) {
        pc.setLocalDescription(desc).catch(logError);
        socket.emit('send', {
          to: [this.props.id, clientId].join(),
          type: 'desc',
          data: desc
        });
      }.bind(this))
      .catch(logError);
  },

  _addIceCandidate(clientId, candidateStr) {
    var iceCandidate = new RTCIceCandidate(candidateStr);
    this.peerConnections[clientId].addIceCandidate(iceCandidate)
      .catch(logError);
  }
});

var ChildVideo = React.createClass({
  render: function() {
    var vidProps = _.pick(this.props, ['id', 'height', 'width']);
    return (
      <video {...vidProps} ref="video" className="video-js" autoPlay controls>
        <p className="vjs-no-js">Unsupported Browser</p>
      </video>
    );
  },

  componentDidMount: function() {
    var qualifiedId = [this.props.parentId, this.props.id].join();
    socket.on(qualifiedId, this._receiveFromParent);
    this._initConnection();
    this._createOffer();
  },

  _initConnection: function() {
    this.pc = new RTCPeerConnection();
    // Register event handler for when we receive the stream
    this.pc.onaddstream = function(evt) {
      this.refs.video.srcObject = evt.stream;
    }.bind(this);
    // Register event handler to send ICE candidates to the parent
    this.pc.onicecandidate = function(evt) {
      if (evt.candidate) {
        socket.emit('send', {
          to: this.props.parentId,
          clientId: this.props.id,
          type: 'icecandidate',
          data: evt.candidate
        });
      }
    }.bind(this);
  },

  _createOffer: function() {
    this.pc.createOffer({ offerToReceiveVideo: 1, offerToReceiveAudio: 1 })
      .then(function(desc) {
        this.pc.setLocalDescription(desc).catch(logError);
        socket.emit('send', {
          to: this.props.parentId,
          clientId: this.props.id,
          type: 'desc',
          data: desc
        });
      }.bind(this))
      .catch(logError);
  },

  _receiveFromParent: function(msg) {
    switch (msg.type) {
      case 'desc':
        this._setRemoteDescription(msg.data);
        break;
      case 'icecandidate':
        this._addIceCandidate(msg.data)
        break;
      default:
        console.warn('invalid message type', msg.type);
        break;
    }
  },

  _setRemoteDescription: function(descStr) {
    var desc = new RTCSessionDescription(descStr);
    this.pc.setRemoteDescription(desc).catch(logError);
  },

  _addIceCandidate: function(candidateStr) {
    var iceCandidate = new RTCIceCandidate(candidateStr);
    this.pc.addIceCandidate(iceCandidate).catch(logError);
  }
});

module.exports = {
  ParentVideo: ParentVideo,
  ChildVideo: ChildVideo
};
