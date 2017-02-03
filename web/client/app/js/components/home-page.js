/*
 * home-page.js
 *
 * MediVision website homepage
 */

var React = require('react');

var HomePage = React.createClass({
  render: function() {
    // TODO: Replace with actual homepage design
    var videoUrl = 'oceans.mp4';
    return (
      <div className="home-page">
        <h1>Hello, World!</h1>
        <video
          id="my-video" className="video-js" width="320" height="480"
          preload="auto" controls>
          <source src={videoUrl} type='video/mp4'/>
          <p className="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a web browser that
            <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
          </p>
        </video>
      </div>
    );
  }
});

module.exports = HomePage;
