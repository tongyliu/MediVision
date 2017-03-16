/*
 * chat-box.js
 *
 * A chat-box component, backed by Socket-IO
 */

var React = require('react');
var ReactDOM = require('react-dom');
var io = require('socket.io-client');
var config = require('../config');

var socket = io.connect(config.SOCKET_URL);

var Message = React.createClass({
  render: function() {
    return (
      <div className="chat-box__message list-group-item">
        {this.props.text}
      </div>
    );
  }
});

var ChatBox = React.createClass({
  getInitialState: function() {
    return { messages: [], currentMessage: '' };
  },

  render: function() {
    var messages = this.state.messages.map(function(msg) {
      return <Message key={msg.id} text={msg.text}/>
    });

    messages.push(<div ref='messagesEnd' key='messagesEnd'></div>);

    return (
      <div className="chat-box panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.title}</h3>
        </div>
        <div className="panel-body list-group">
          {messages}
        </div>
        <div className="panel-footer">
          <form className="input-group" onSubmit={this._handleSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter a message"
              onChange={this._onChange}
              value={this.state.currentMessage}
            />
            <span className="input-group-btn">
              <button className="btn btn-success">Send</button>
            </span>
          </form>
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    socket.on(this.props.roomId, this._receiveMsg);
  },

  componentDidUpdate: function(prevProps, prevState) {
    // Scroll to last message
    var endNode = ReactDOM.findDOMNode(this.refs.messagesEnd);
    endNode.scrollIntoView({ behavior: 'smooth' });
  },

  _receiveMsg: function(msg) {
    this.setState({ messages: this.state.messages.concat([msg]) });
  },

  _onChange: function(evt) {
    this.setState({ currentMessage: evt.target.value });
  },

  _handleSubmit: function(evt) {
    evt.preventDefault();

    socket.emit('chat', {
      to: this.props.roomId,
      text: this.state.currentMessage
    });

    this.setState({ currentMessage: '' })
  }
});

module.exports = ChatBox;
