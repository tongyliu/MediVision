var React = require('react');
var Link = require('react-router').Link;

var TopBar = React.createClass({
  render: function() {
    return (
      <div className="top-bar header clearfix">
        <Link to="/"><h3 className="text-muted">MediVision</h3></Link>
      </div>
    );
  }
});

module.exports = TopBar;
