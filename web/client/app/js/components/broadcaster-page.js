/*
 * broadcaster-page.js
 *
 * Page for users to setup and start broadcasting a stream
 */

var React = require('react');
var ParentVideo = require('./webrtc-video').ParentVideo;
var StreamDesc = require('./stream-desc');
var Address4 = require('ip-address').Address4;
var classNames = require('classnames');
var request = require('request');
var qs = require('qs');
var config = require('../config');

var r = request.defaults({ baseUrl: config.API_URL, json: true });

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
    return { streamId: null };
  },

  render: function() {
    var pageComponent;

    if (!this.state.streamId) {
      pageComponent = <StreamForm onSubmit={this._submitStreamInfo}/>
    } else {
      var videoUrl = this._generateVideoUrl();
      pageComponent = (
        <div>
          <ParentVideo
            streamId={this.state.streamId} src={videoUrl}
            autoPlay={true} loop={true}
          />
          <StreamDesc stream={this.state.streamInfo}/>
          <a
            className={classNames('btn btn-lg stream-btn', {
              'btn-success': !this.state.streamActive,
              'btn-danger': this.state.streamActive
            })}
            onClick={this._togglePublishedState}>
            {!this.state.streamActive ? 'Start Streaming' : 'Stop Streaming'}
          </a>
        </div>
      );
    }

    return (
      <div className="broadcaster-page">
        {pageComponent}
      </div>
    );
  },

  componentDidMount: function() {
    this.props.router.setRouteLeaveHook(this.props.route, function() {
      if (this.state.streamActive) {
        this._unpublishStream(true);
      }
    }.bind(this));
  },

  _generateVideoUrl: function() {
    var baseUrl = 'http://' + this.state.streamInfo.ip;
    var queryString = qs.stringify({
      holo: false,
      pv: true,
      mic: true,
      loopback: false
    });
    return baseUrl + '/api/holographic/stream/live_high.mp4?' + queryString;
  },

  _submitStreamInfo: function(info) {
    r.post({ url: '/stream/', form: {
      stream_name: info.title,
      stream_short_desc: info.tagline,
      stream_full_desc: info.desc,
      stream_ip: info.ip
    }}, function(err, res, body) {
      if (!err && res.statusCode == 200 && body['success']) {
        var streamId = body['stream_id'];
        console.log('received stream ID:', streamId);
        this.setState({ streamId: streamId, streamInfo: info });
      } else {
        console.warn('API request returned error');
      }
    }.bind(this));
  },

  _togglePublishedState: function() {
    if (this.state.streamActive) {
      this._unpublishStream();
    } else {
      this._publishStream();
    }
  },

  _publishStream: function() {
    var endpointUrl = '/stream/activate/' + this.state.streamId;
    r.put(endpointUrl, function(err, res, body) {
      if (!err && res.statusCode == 200 && body['success']) {
        this.setState({ streamActive: true });
      } else {
        console.warn('API request returned error');
      }
    }.bind(this));
  },

  _unpublishStream: function(componentWillUnmount) {
    var endpointUrl = '/stream/' + this.state.streamId;
    r.delete(endpointUrl, function(err, res, body) {
      if (!err && res.statusCode == 200 && body['success']) {
        if (!componentWillUnmount) {
          this.setState({ streamActive: false });
        }
      } else {
        console.warn('API request returned error');
      }
    }.bind(this));
  }
});

module.exports = BroadcasterPage;
