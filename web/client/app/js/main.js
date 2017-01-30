/**
 * main.js
 *
 * Entry point into the app
 */

var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  render: function() {
    return (
      <div className='app'>
        <h1>Hello, World!</h1>
        <video id="my-video" class="video-js" controls preload="auto" width="640" height="264"
               poster="MY_VIDEO_POSTER.jpg" data-setup="{}">
          <source src="/oceans.mp4" type='video/mp4'/>
              <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider upgrading to a web browser that
                <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
              </p>
        </video>
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app-container')
);
