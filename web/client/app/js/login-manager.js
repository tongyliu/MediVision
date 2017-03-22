/*
 * login-manager.js
 *
 * Global store for authentication state
 */

var browserHistory = require('react-router').browserHistory;

class _LoginManager {
  constructor() {
    this.token = null;
    this.userObj = true;
  }

  isLoggedIn() {
    return !!this.userObj;
  }

  setRedirectUrl(url) {
    console.log('redirect url set to', url);
    this.redirectUrl = url;
  }

  clearRedirectUrl() {
    console.log('redirect url cleared');
    this.redirectUrl = null;
  }

  logout() {
    this.token = null;
    this.userObj = null;
    browserHistory.replace('/');
  }
}

var LoginManager = new _LoginManager();

module.exports = LoginManager;
