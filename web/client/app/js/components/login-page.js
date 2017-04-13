/*
 * login-page.js
 *
 * Page for users to sign in to their accounts
 */

var React = require('react');
var LoginManager = require('../login-manager');
var ApiRequest = require('../utils/api-utils').ApiRequest;

var LoginPage = React.createClass({
  getInitialState: function() {
    return { username: '', password: '' };
  },

  render: function() {
    var redirectionAlert = null;
    if (LoginManager.hasRedirectUrl()) {
      redirectionAlert = (
        <div className="alert alert-warning" role="alert">
          <strong>Wait!</strong> That page requires authentication.
          Please sign in to proceed.
        </div>
      );
    }

    var loginFailedAlert = null;
    if (this.state.loginFailed) {
      loginFailedAlert = (
        <div className="alert alert-danger" role="alert">
          <strong>Whoops!</strong> Failed to sign in.
          Check your credentials and try again.
        </div>
      );
    }

    return (
      <div className="login-page">
        <h1>Sign In</h1>
        {redirectionAlert}
        {loginFailedAlert}
        <div className="panel panel-default no-border">
          <div className="panel-body">
            <form onSubmit={this._handleSubmit}>
              <div className="form-group">
                <label htmlFor="username-input">Username</label>
                <input
                  id="username-input" className="form-control" type="text"
                  onChange={this._onChange.bind(this, 'username')}
                  value={this.state.username}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password-input">Password</label>
                <input
                  id="password-input" className="form-control" type="password"
                  onChange={this._onChange.bind(this, 'password')}
                  value={this.state.password}
                />
              </div>
              <button className="btn btn-lg btn-success">Go</button>
            </form>
          </div>
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    if (LoginManager.isLoggedIn()) {
      this.props.router.replace('/');
    }
  },

  _onChange: function(key, evt) {
    var updateHash = {};
    updateHash[key] = evt.target.value;
    this.setState(updateHash);
  },

  _handleSubmit: function(evt) {
    evt.preventDefault();

    new ApiRequest().post({ url: '/auth/login', form: {
      username: this.state.username,
      password: this.state.password
    }}, function(err, res, body) {
      if (!err && res.statusCode == 200 && body['success']) {
        var userObj = { id: body['user_id'], name: body['name'] };
        LoginManager.login(userObj, body['token']);
      } else {
        this.setState({ loginFailed: true });
      }
    }.bind(this));
  }
});

module.exports = LoginPage;
