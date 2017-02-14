/*
 * home-page.js
 *
 * MediVision website homepage
 */

var React = require('react');
var ParentVideo = require('./webrtc-video').ParentVideo;

var HomePage = React.createClass({
  render: function() {
    // TODO: Replace with actual homepage design
    var videoUrl = 'oceans.mp4';
    return (
      <div className="home-page">
        <h1>Hello, World!</h1>
        <ParentVideo id="my-video" width="320px" height="480px" src={videoUrl}/>
      </div>
    );
  }
});

module.exports = HomePage;
