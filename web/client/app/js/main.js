/*
 * main.js
 *
 * Entry point into the app
 */

var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');

var TopBar = require('./components/top-bar');
var HomePage = require('./components/home-page');
var BroadcasterPage = require('./components/broadcaster-page');
var StreamsPage = require('./components/streams-page');
var ViewerPage = require('./components/viewer-page');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;

var Page = React.createClass({
  render: function() {
    return (
      <div>
        <TopBar />
        <div className="container-fluid">
          {this.props.content}
        </div>
      </div>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Page}>
          <IndexRoute components={{ content: HomePage }}/>
          <Route path="broadcast" components={{ content: BroadcasterPage }}/>
          <Route path="streams" components={{ content: StreamsPage }}/>
          <Route path="view-stream" components={{ content: ViewerPage }}/>
        </Route>
      </Router>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app-container')
);
