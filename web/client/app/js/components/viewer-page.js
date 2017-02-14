/*
 * viewer-page.js
 *
 * Page for users to watch a single stream
 */

var React = require('react');
var ChildVideo = require('./webrtc-video').ChildVideo;

var ViewerPage = React.createClass({
  render: function() {
    // TODO: Replace with actual page design
    var id = 0;
    var parentId = 'my-video';
    return (
      <div className="viewer-page">
        <h1>View Stream</h1>
        <ChildVideo id={id} parentId={parentId} width="320px" height="480px"/>
      </div>
    );
  }
});

module.exports = ViewerPage;
