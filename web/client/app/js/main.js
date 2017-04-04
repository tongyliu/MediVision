/*
 * main.js
 *
 * Entry point into the app
 */

var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var History = require('history');

var LoginManager = require('./login-manager');

var TopBar = require('./components/top-bar');
var HomePage = require('./components/home-page');
var LoginPage = require('./components/login-page');
var RegisterPage = require('./components/register-page');
var BroadcasterPage = require('./components/broadcaster-page');
var StreamsPage = require('./components/streams-page');
var ViewerPage = require('./components/viewer-page');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var useRouterHistory = ReactRouter.useRouterHistory;
var createHistory = History.createHistory;
var useBeforeUnload = History.useBeforeUnload;

// Ensure that router lifecycle hooks get called even when the browser window
// is refreshed or closed
var browserHistory = useBeforeUnload(useRouterHistory(createHistory))();

var Page = React.createClass({
  render: function() {
    return (
      <div>
        <TopBar pathname={this.props.location.pathname}/>
        <div className="container-fluid">{this.props.content}</div>
      </div>
    );
  }
});

var AuthenticatedPage = React.createClass({
  render: function() {
    var content = LoginManager.isLoggedIn() ? this.props.content : null;
    return (
      <div>
        <TopBar />
        <div className="container-fluid">{content}</div>
      </div>
    );
  },

  componentDidMount: function() {
    if (!LoginManager.isLoggedIn()) {
      LoginManager.setRedirectUrl(this.props.location.pathname);
      this.props.router.replace('/login');
    }
  }
});

var App = React.createClass({
  render: function() {
    return (
      <Router history={browserHistory}>
        <Route component={Page}>
          <Route path="/" components={{ content: HomePage }}/>
          <Route path="/login" components={{ content: LoginPage }}/>
          <Route path="/register" components={{ content: RegisterPage }}/>
        </Route>
        <Route component={AuthenticatedPage}>
          <Route path="/broadcast" components={{ content: BroadcasterPage }}/>
          <Route path="/streams" components={{ content: StreamsPage }}/>
          <Route path="/view-stream" components={{ content: ViewerPage }}/>
        </Route>
      </Router>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app-container')
);
