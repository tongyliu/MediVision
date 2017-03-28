/*
 * streams-page.js
 *
 * Page for users to browse available streams
 */

var React = require('react');
var Link = require('react-router').Link;
var classNames = require('classnames');
var request = require('request');
var config = require('../config');

var r = request.defaults({ baseUrl: config.API_URL, json: true });

var StreamsPage = React.createClass({
  getInitialState: function() {
    return { streams: [] };
  },

  render: function() {
    var streamComponents = this.state.streams.map(function(stream) {
      return (
        <div key={stream['stream_id']} className="col-sm-6 col-md-4">
          <div className="thumbnail no-border">
            <div className="caption">
              <h3>{stream['stream_name']}</h3>
              <p className={classNames('text-muted', {
                'no-tagline': !stream['stream_short_desc']
              })}>
                {stream['stream_short_desc'] || 'No tagline provided'}
              </p>
              <Link
                to={'/view-stream?stream_id=' + stream['stream_id']}
                className="btn btn-success">
                View
              </Link>
            </div>
          </div>
        </div>
      );
    });

    if (!streamComponents.length) {
      streamComponents = (
        <h3 className="no-stream-msg text-muted">
          No streams available.
        </h3>
      );
    }

    return (
      <div className="streams-page">
        <h1>Browse Available Streams</h1>
        <div className="row stream-list">
          {streamComponents}
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    r.get('/stream/', function(err, res, body) {
      if (!err && res.statusCode == 200 && body['success']) {
        this.setState({ streams: body['active_streams'] });
      } else {
        console.warn('API request returned error');
      }
    }.bind(this));
  }
});

module.exports = StreamsPage;
