/*
 * login-manager.js
 *
 * Global store for authentication state
 */

class _LoginManager {
  initWithHistory(history) {
    this.browserHistory = history;
  }

  isLoggedIn() {
    var userObj = localStorage.getItem('userObj');
    var token = localStorage.getItem('token');
    return !!userObj && !!token;
  }

  getUser() {
    return JSON.parse(localStorage.getItem('userObj'));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  hasRedirectUrl() {
    return !!this.redirectUrl;
  }

  setRedirectUrl(url) {
    this.redirectUrl = url;
  }

  clearRedirectUrl() {
    this.redirectUrl = null;
  }

  login(user, token) {
    if (!this.browserHistory) {
      this._showHistoryError('login');
      return;
    }

    this.redirectUrl = null;
    localStorage.setItem('userObj', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.browserHistory.replace(this.redirectUrl || '/');
  }

  logout() {
    if (!this.browserHistory) {
      this._showHistoryError('logout');
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('userObj');
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
