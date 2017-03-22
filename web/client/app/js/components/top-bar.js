var React = require('react');
var Link = require('react-router').Link;
var LoginManager = require('../login-manager');

var TopBar = React.createClass({
  render: function() {
    var content = null;

    switch (LoginManager.isLoggedIn()) {
      case true:
        // TODO: Replace with actual user name
        var welcomeMsg = 'Hello, World!';
        content = (
          <div>
            <h5 className="welcome-msg text-muted">{welcomeMsg}</h5>
            <a className="btn btn-danger" onClick={this._handleLogout}>
              Sign Out
            </a>
          </div>
        );
        break;
      case false:
        var buttons = [];
        if (this.props.pathname != '/login') {
          buttons.push(
            <Link
              to="/login"
              className="btn btn-primary"
              key="login-btn">
              Sign In
            </Link>
          );
        }
        if (this.props.pathname != '/register') {
          buttons.push(
            <Link
              to="/register"
              className="btn btn-success"
              key="register-btn">
              Sign Up
            </Link>
          );
        }
        content = <nav>{buttons}</nav>
        break;
      default:
        break;
    }

    return (
      <div className="top-bar header clearfix">
        <Link to="/"><h3 className="logo text-muted">MediVision</h3></Link>
        <div className="top-bar__right-side">
          {content}
        </div>
      </div>
    );
  },

  _handleLogout: function() {
    LoginManager.logout();
  }
});

module.exports = TopBar;
