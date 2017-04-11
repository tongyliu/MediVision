/*
 * api-utils.js
 *
 * Helpers to simplify making API requests
 */

var LoginManager = require('../login-manager');
var config = require('../config');
var request = require('request');

/*
 * Wrapper class around the request library that allows us to easily make
 * API requests without specifying the default configuration every time.
 *
 * Arguments passed to the get, post, put, patch, and delete methods are
 * forwarded as-is to the corresponding method from the request library.
 */
class ApiRequest {
  constructor() {
    this.r = request.defaults({ baseUrl: config.API_URL, json: true });
  }

  get() {
    this.r.get.apply(this.r, arguments);
  }

  post() {
    this.r.post.apply(this.r, arguments);
  }

  put() {
    this.r.put.apply(this.r, arguments);
  }

  patch() {
    this.r.patch.apply(this.r, arguments);
  }

  delete() {
    this.r.delete.apply(this.r, arguments);
  }
}

/*
 * Identical to the ApiRequest class, but also includes JWT authentication
 * using a token fetched from the LoginManager.
 *
 * Token retrieval happens upon instantiation, so be careful of reusing a
 * single instance of this class for multiple requests if it's possible that
 * the user's login status can change between the requests.
 */
class ApiRequestWithAuth extends ApiRequest {
  constructor() {
    super();
    this.r = this.r.defaults({ auth: { bearer: LoginManager.getToken() }});
  }
}

module.exports = {
  ApiRequest: ApiRequest,
  ApiRequestWithAuth: ApiRequestWithAuth
};
