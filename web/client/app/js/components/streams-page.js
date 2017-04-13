/*
 * streams-page.js
 *
 * Page for users to browse available streams
 */

var React = require('react');
var Link = require('react-router').Link;
var ApiRequestWithAuth = require('../utils/api-utils').ApiRequestWithAuth;
var classNames = require('classnames');

var StreamsPage = React.createClass({
  getInitialState: function() {
    return { streams: undefined };
  },

  render: function() {
    var streamComponents = null;

    if (Array.isArray(this.state.streams)) {
      streamComponents = this.state.streams.map(function(stream) {
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
    new ApiRequestWithAuth().get('/stream/', function(err, res, body) {
      if (!err && res.statusCode == 200 && body['success']) {
        this.setState({ streams: body['active_streams'] });
      } else {
        this.setState({ streams: [] });
        console.warn('API request returned error');
      }
    }.bind(this));
  }
});

module.exports = StreamsPage;
