/*
 * login-page.js
 *
 * Page for users to sign up with new accounts
 */

var React = require('react');
var LoginManager = require('../login-manager');

var RegisterPage = React.createClass({
  getInitialState: function() {
    return {
      name: '',
      username: '',
      password: '',
      retypedPassword: ''
    };
  },

  render: function() {
    return (
      <div className="register-page">
        <h1>Sign Up</h1>
        <div className="panel panel-default no-border">
          <div className="panel-body">
            <form onSubmit={this._handleSubmit}>
              <div className="form-group">
                <label htmlFor="name-input">Name</label>
                <input
                  id="name-input" className="form-control" type="text"
                  onChange={this._onChange.bind(this, 'name')}
                  value={this.state.name}
                />
              </div>
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
              <div className="form-group">
                <label htmlFor="confirm-input">Confirm Password</label>
                <input
                  id="confirm-input" className="form-control" type="password"
                  onChange={this._onChange.bind(this, 'retypedPassword')}
                  value={this.state.retypedPassword}
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
    // TODO
    console.log('register form submitted');
  }
});

module.exports = RegisterPage;
