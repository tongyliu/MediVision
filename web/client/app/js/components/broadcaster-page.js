/*
 * broadcaster-page.js
 *
 * Page for users to setup and start broadcasting a stream
 */

var React = require('react');
var ParentVideo = require('./webrtc-video').ParentVideo;
var Address4 = require('ip-address').Address4;
var qs = require('qs');

var StreamForm = React.createClass({
  getInitialState: function() {
    return { ip: '', title: '', tagline: '', desc: '' };
  },

  render: function() {
    return (
      <div className="stream-form">
        <h1>Start a Stream</h1>
        <div className="panel panel-default no-border">
          <div className="panel-body">
            <form onSubmit={this._handleSubmit}>
              <div className="form-group">
                <label htmlFor="ip-input">HoloLens IP Address</label>
                <input
                  id="ip-input" className="form-control" type="text"
                  onChange={this._onChange.bind(this, 'ip')}
                  value={this.state.ip}
                />
                <p className="help-block">
                  We use this IP address to connect to the video feed from your
                  HoloLens. To find the IP address, ensure that your HoloLens
                  is connected to the same Wi-Fi network as this computer, and
                  then open the MediVision app on your HoloLens.
                </p>
              </div>
              <hr/>
              <div className="form-group">
                <label htmlFor="title-input">Stream Title</label>
                <input
                  id="title-input" className="form-control" type="text"
                  onChange={this._onChange.bind(this, 'title')}
                  value={this.state.title}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tagline-input">Stream Tagline</label>
                <input
                  id="tagline-input" className="form-control" type="text"
                  onChange={this._onChange.bind(this, 'tagline')}
                  value={this.state.tagline}
                />
              </div>
              <div className="form-group">
                <label htmlFor="desc-input">Stream Description</label>
                <textarea
                  id="desc-input" className="form-control" rows="3"
                  onChange={this._onChange.bind(this, 'desc')}
                  value={this.state.desc}
                />
              </div>
              <button className="btn btn-lg btn-success">
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  },

  _onChange: function(key, evt) {
    var updateHash = {};
    updateHash[key] = evt.target.value;
    this.setState(updateHash);
  },

  _handleSubmit: function(evt) {
    evt.preventDefault();
    if (this._validate()) {
      this.props.onSubmit(this.state);
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
      pageComponent = <StreamForm onSubmit={this.submitStreamInfo}/>
    }

    return (
      <div className="broadcaster-page">
        {pageComponent}
      </div>
    );
  },

  submitStreamInfo: function(info) {
    this.setState({
      holoLensIp: info.ip,
      streamTitle: info.title,
      streamTagline: info.tagline,
      streamDesc: info.desc
    });
  },

  _generateVideoUrl: function() {
    var baseUrl = 'http://' + this.state.holoLensIp;
    var queryString = qs.stringify({
      holo: false,
      pv: true,
      mic: true,
      loopback: false
    });
    return baseUrl + '/api/holographic/stream/live_high.mp4?' + queryString;
  }
});

module.exports = BroadcasterPage;
