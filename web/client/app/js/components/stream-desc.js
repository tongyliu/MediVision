var React = require('react');
var classNames = require('classnames');

var StreamDesc = React.createClass({
  render: function() {
    var content = [];

    if (this.props.stream['tagline']) {
      content.push(
        <p key="tagline" className="text-muted">
          {this.props.stream['tagline']}
        </p>
      );
    }

    if (this.props.stream['desc']) {
      content.push(
        <div key="desc">
          <hr/>
          <p>{this.props.stream['desc']}</p>
        </div>
      );
    }

    if (!content.length) {
      content.push(
        <p key="no-desc" className="text-muted no-desc">
          No description provided
        </p>
      );
    }

    return (
      <div className="stream-desc panel no-border">
        <h3>{this.props.stream['title']}</h3>
        {content}
      </div>
    );
  }
});

module.exports = StreamDesc;
