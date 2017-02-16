/*
 * broadcaster-page.js
 *
 * Page for users to setup and start broadcasting a stream
 */

var React = require('react');
var ParentVideo = require('./webrtc-video').ParentVideo;
var Address4 = require('ip-address').Address4;
var qs = require('qs');

var IpForm = React.createClass({
  getInitialState: function() {
    return { ip: '' };
  },

  render: function() {
    return (
      <form className="ip-form" onSubmit={this._handleSubmit}>
        <label htmlFor="ip-input">Enter HoloLens IP Address</label>
        <input
          id="ip-input" type="text"
          onChange={this._onChange} value={this.state.ip}
        />
      </form>
    );
  },

  _onChange: function(evt) {
    this.setState({ ip: evt.target.value });
  },

  _handleSubmit: function(evt) {
    evt.preventDefault();
    if (this._validate()) {
      this.props.onSubmit(this.state.ip);
    } else {
      alert('Invalid IP address, try again.');
    }
  },

  _validate: function() {
    var addr = new Address4(this.state.ip);
    return addr.isValid();
  }
});

var BroadcasterPage = React.createClass({
  getInitialState: function() {
    return { holoLensIp: null };
  },

  render: function() {
    var pageComponent;

    if (this.state.holoLensIp) {
      var videoUrl = this._generateVideoUrl();
      pageComponent = <ParentVideo src={videoUrl} autoPlay={true} loop={true}/>
    } else {
      pageComponent = <IpForm onSubmit={this.submitIp}/>
    }

    return (
      <div className="broadcaster-page">
        <h1>Start a Stream</h1>
        {pageComponent}
      </div>
    );
  },

  submitIp: function(ip) {
    this.setState({ holoLensIp: ip });
  },

  _generateVideoUrl: function() {
    var baseUrl = 'https://' + this.state.holoLensIp;
    var queryString = qs.stringify({
      holo: false,
      pv: true,
      mic: true,
      loopback: false
    });
    return baseUrl + '/api/holographic/stream/live_high.mp4' + queryString;
  }
});

module.exports = BroadcasterPage;
