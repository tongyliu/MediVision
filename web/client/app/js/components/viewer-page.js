/*
 * viewer-page.js
 *
 * Page for users to watch a single stream
 */

var React = require('react');
var ChildVideo = require('./webrtc-video').ChildVideo;
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
    if (this.state.id !== undefined) {
      comp = <ChildVideo id={this.state.id} parentId={this.state.parentId}/>;
    } else {
      comp = <h3>Stream Unavailable</h3>;
    }

    return (
      <div className="viewer-page">
        <h1>View Stream</h1>
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
      }
    }.bind(this));
  }
});

module.exports = ViewerPage;
