var React = require('react');

var LoginPage = React.createClass({
  getInitialState: function() {
    return { username: '', password: '' };
  },

  render: function() {
    return (
      <div className="login-page">
        <h1>Sign In</h1>
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

  _onChange: function(key, evt) {
    var updateHash = {};
    updateHash[key] = evt.target.value;
    this.setState(updateHash);
  },

  _handleSubmit: function(evt) {
    evt.preventDefault();
    // TODO
    console.log('login form submitted');
  }
});

module.exports = LoginPage;
