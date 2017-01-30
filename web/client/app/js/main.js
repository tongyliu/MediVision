/**
 * main.js
 *
 * Entry point into the app
 */

var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  render: function() {
    return (
      <div className='app'>
        <h1>Hello, World!</h1>
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app-container')
);
