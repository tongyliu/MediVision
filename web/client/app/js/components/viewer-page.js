/*
 * viewer-page.js
 *
 * Page for users to watch a single stream
 */

var React = require('react');
var ChildVideo = require('./webrtc-video').ChildVideo;
var ChatBox = require('./chat-box');
var classNames = require('classnames');
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

    // Create dummy stream object for now
    var stream = { 'title': this.state.parentId };
    // And dummy chat room ID
    var chatRoom = 'foo';

    if (this.state.id == -1) {
      comp = <h3>Stream Unavailable</h3>;
    } else if (this.state.id !== undefined) {
      comp = (
        <div className="row">
          <div className="col col-md-8">
            <ChildVideo id={this.state.id} parentId={this.state.parentId}/>
            <div className="video-desc panel no-border">
              <h3>{stream['title']}</h3>
              <p className={classNames({
                'text-muted': !stream['desc']
              })}>
                {stream['desc'] || 'No description provided'}
              </p>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <ChatBox title="Doctor Chat" roomId={chatRoom}/>
          </div>
          <div className="col-md-4 col-sm-6">
            <ChatBox title="Viewer Chat" roomId={chatRoom}/>
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
        this.setState({ id: body['client_id'] });
      } else {
        console.warn('API request returned error');
        this.setState({ id: -1 });
      }
    }.bind(this));
  }
});

module.exports = ViewerPage;
