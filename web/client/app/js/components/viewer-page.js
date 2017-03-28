/*
 * viewer-page.js
 *
 * Page for users to watch a single stream
 */

var React = require('react');
var ChildVideo = require('./webrtc-video').ChildVideo;
var ChatBox = require('./chat-box');
var StreamDesc = require('./stream-desc');
var request = require('request');
var config = require('../config');

var r = request.defaults({ baseUrl: config.API_URL, json: true });

var ViewerPage = React.createClass({
  getInitialState: function() {
    var queryParams = this.props.location.query;
    return { parentId: queryParams['stream_id'] };
  },

  render: function() {
    var comp = null;

    if (this.state.id == -1) {
      comp = <h3>Stream Unavailable</h3>;
    } else if (this.state.id !== undefined) {
      comp = (
        <div className="row">
          <div className="col col-md-8">
            <ChildVideo id={this.state.id} parentId={this.state.parentId}/>
            <StreamDesc stream={this.state.stream}/>
          </div>
          <div className="col-md-4 col-sm-6">
            <ChatBox
              title="Doctor Chat"
              streamId={this.state.parentId}
              viewerOnly={false}
            />
          </div>
          <div className="col-md-4 col-sm-6">
            <ChatBox
              title="Viewer Chat"
              streamId={this.state.parentId}
              viewerOnly={true}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="viewer-page">
        {comp}
      </div>
    );
  },

  componentDidMount: function() {
    var queryParams = this.props.location.query;
    if (!queryParams['stream_id']) {
      console.warn('Missing stream_id query parameter');
      return;
    }

    r.get('/stream/' + queryParams['stream_id'], function(err, res, body) {
      if (!err && res.statusCode == 200 && body['success']) {
        var stream = this._convertStream(body['stream']);
        this.setState({ id: body['client_id'], stream: stream });
      } else {
        console.warn('API request returned error');
        this.setState({ id: -1 });
      }
    }.bind(this));
  },

  _convertStream: function(rawStream) {
    return {
      id: rawStream['stream_id'],
      title: rawStream['stream_name'],
      tagline: rawStream['stream_short_desc'],
      desc: rawStream['stream_full_desc']
    }
  }
});

module.exports = ViewerPage;
