/*
 * register-page.js
 *
 * Page for users to sign up with new accounts
 */

var React = require('react');
var LoginManager = require('../login-manager');
var ApiRequest = require('../utils/api-utils').ApiRequest;
var classNames = require('classNames');
var _ = require('lodash');

var RegisterPage = React.createClass({
  getInitialState: function() {
    return {
      name: '',
      username: '',
      password: '',
      retypedPassword: '',
      passwordsMatch: true,
      isValid: false
    };
  },

  componentWillMount: function() {
    // Only check the password match status after typing has paused
    this._checkPasswordsMatch = _.debounce(this._checkPasswordsMatch, 300);
  },

  render: function() {
    var registerFailedAlert = null;
    if (this.state.registerFailed && this.state.errorDetail) {
      registerFailedAlert = (
        <div className="alert alert-danger" role="alert">
          <strong>Whoops!</strong> Couldn't sign up: {this.state.errorDetail}
        </div>
      );
    } else if (this.state.registerFailed) {
      registerFailedAlert = (
        <div className="alert alert-danger" role="alert">
          <strong>Whoops!</strong> Failed to sign up, try again later.
        </div>
      );
    }

    return (
      <div className="register-page">
        <h1>Sign Up</h1>
        {registerFailedAlert}
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
              <div className={classNames('form-group', {
                'has-error': !this.state.passwordsMatch
              })}>
                <label htmlFor="confirm-input">Confirm Password</label>
                <input
                  id="confirm-input" className="form-control" type="password"
                  onChange={this._onChange.bind(this, 'retypedPassword')}
                  value={this.state.retypedPassword}
                />
              </div>
              <button
                className="btn btn-lg btn-success"
                disabled={!this.state.isValid}>
                Go
              </button>
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
    if (key == 'password' || key == 'retypedPassword') {
      this.setState(updateHash, this._checkPasswordsMatch);
    } else {
      this.setState(updateHash, this._validate);
    }
  },

  _checkPasswordsMatch: function() {
    if (this.state.retypedPassword) {
      var isMatch = this.state.password == this.state.retypedPassword;
      this.setState({ passwordsMatch: isMatch }, this._validate);
    } else {
      // Don't show an error if nothing has been typed yet
      this.setState({ passwordsMatch: true }, this._validate);
    }
  },

  _validate: function() {
    var isValid = this.state.name && this.state.username && this.state.password
                  && this.state.retypedPassword && this.state.passwordsMatch;
    this.setState({ isValid: isValid });
  },

  _handleSubmit: function(evt) {
    evt.preventDefault();

    new ApiRequest().post({ url: '/auth/create', form: {
      name: this.state.name,
      username: this.state.username,
      password: this.state.password
    }}, function(err, res, body) {
      if (!err && res.statusCode == 200) {
        if (body['success']) {
          var userObj = { id: body['user_id'], name: this.state.name };
          LoginManager.login(userObj, body['token']);
        } else {
          this.setState({ registerFailed: true, errorDetail: body['detail'] });
        }
      } else {
        this.setState({ registerFailed: true });
      }
    }.bind(this));
  }
});

module.exports = RegisterPage;
