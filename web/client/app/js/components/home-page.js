/*
 * home-page.js
 *
 * MediVision website homepage
 */

var React = require('react');
var Link = require('react-router').Link;
var TopBar = require('./top-bar');

var HomePage = React.createClass({
  render: function() {
    return (
      <div className="home-page">
        <TopBar />
        <div className="jumbotron">
          <h1>MediVision</h1>
          <p className="lead">
            Better medical training through real-time video streaming.
            MediVision allows students and residents to learn from real-world
            cases as they happen, without having to physically be in a
            hospital.
          </p>
          <nav>
            <Link to="/broadcast" className="btn btn-lg btn-primary">
              Start a Stream
            </Link>
            <Link to="/streams" className="btn btn-lg btn-primary">
              Browse Streams
            </Link>
          </nav>
        </div>
      </div>
    );
  }
});

module.exports = HomePage;
