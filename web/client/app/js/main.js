/*
 * main.js
 *
 * Entry point into the app
 */

var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');

var HomePage = require('./components/home-page');
var BroadcasterPage = require('./components/broadcaster-page');
var StreamsPage = require('./components/streams-page');
var ViewerPage = require('./components/viewer-page');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var browserHistory = ReactRouter.browserHistory;

var App = React.createClass({
  render: function() {
    return (
      <Router history={browserHistory}>
        <Route exact path="/" component={HomePage}/>
        <Route path="/broadcast" component={BroadcasterPage}/>
        <Route path="/streams" component={StreamsPage}/>
        <Route path="/view-stream" component={ViewerPage}/>
      </Router>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app-container')
);
