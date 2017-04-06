/*
 * login-manager.js
 *
 * Global store for authentication state
 */

class _LoginManager {
  constructor() {
    this.token = null;
    this.userObj = true;
  }

  initWithHistory(history) {
    this.browserHistory = history;
  }

  isLoggedIn() {
    return !!this.userObj && !!this.token;
  }

  getUser() {
    return this.userObj;
  }

  setRedirectUrl(url) {
    console.log('redirect url set to', url);
    this.redirectUrl = url;
  }

  clearRedirectUrl() {
    console.log('redirect url cleared');
    this.redirectUrl = null;
  }

  login(user, token) {
    if (!this.browserHistory) {
      this._showHistoryError('login');
      return;
    }
    this.userObj = user;
    this.token = token;
    this.browserHistory.replace(this.redirectUrl || '/');
  }

  logout() {
    if (!this.browserHistory) {
      this._showHistoryError('logout');
      return;
    }
    this.token = null;
    this.userObj = null;
    this.browserHistory.replace('/');
  }

  _showHistoryError(fn) {
    var msg = 'Warning: ' + fn + '() called without a valid history object. '
              + 'This is a no-op. Check that LoginManager.initWithHistory() '
              + 'was properly called.';
    console.error(msg);
  }
}

var LoginManager = new _LoginManager();

module.exports = LoginManager;
