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

  getLeavingToken() {
    return this.leavingToken; // See the logout method below
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

    localStorage.setItem('userObj', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.browserHistory.replace(this.redirectUrl || '/');
    this.redirectUrl = null;
  }

  logout() {
    if (!this.browserHistory) {
      this._showHistoryError('logout');
      return;
    }

    // Save a copy of the token in memory so that callbacks registered on
    // page exit can still perform any necessary clean-up tasks using this
    // token, even if we are leaving a page by logging out
    this.leavingToken = localStorage.getItem('token');

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
