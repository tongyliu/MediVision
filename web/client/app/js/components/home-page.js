/*
 * home-page.js
 *
 * MediVision website homepage
 */

var React = require('react');
var Link = require('react-router').Link;
var LoginManager = require('../login-manager');

var HomePage = React.createClass({
  render: function() {
    return (
      <div className="home-page">
        <div className="jumbotron no-border">
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
  },

  componentDidMount: function() {
    // This prevents us from redirecting to the wrong page if a user
    // returns to the home page from the login or register page
    LoginManager.clearRedirectUrl();
  }
});

module.exports = HomePage;
