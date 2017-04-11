/*
 * chat-box.js
 *
 * A chat-box component, backed by Socket-IO
 */

var React = require('react');
var ReactDOM = require('react-dom');
var ApiRequestWithAuth = require('../utils/api-utils').ApiRequestWithAuth;
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
      <div className="chat-box panel no-border">
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
    new ApiRequestWithAuth().get({ url: '/chat/' + this.props.streamId, qs: {
      viewer_only: this.props.viewerOnly
    }}, function(err, res, body) {
      if (!err && res.statusCode == 200 && body['success']) {
        var messages = this._convertHistory(body['chat_messages']);
        this.setState({ messages: messages }, function() {
          socket.on(this._getRoomId(), this._receiveMsg);
        });
      } else {
        console.warn('API request returned error');
      }
    }.bind(this));
  },

  componentDidUpdate: function(prevProps, prevState) {
    // Scroll to last message
    if (prevState.messages.length != this.state.messages.length) {
      var endNode = ReactDOM.findDOMNode(this.refs.messagesEnd);
      endNode.parentNode.scrollTop = endNode.offsetTop;
    }
  },

  _receiveMsg: function(msg) {
    this.setState({ messages: this.state.messages.concat([msg]) });
  },

  _onChange: function(evt) {
    this.setState({ currentMessage: evt.target.value });
  },

  _handleSubmit: function(evt) {
    evt.preventDefault();

    if (this.state.currentMessage) {
      socket.emit('chat', {
        to: this._getRoomId(),
        text: this.state.currentMessage
      });
      this.setState({ currentMessage: '' });
    }
  },

  _getRoomId: function() {
    if (this.props.viewerOnly) {
      return this.props.streamId + '__viewer-chat';
    } else {
      return this.props.streamId + '__doctor-chat';
    }
  },

  _convertHistory: function(msgArr) {
    if (!msgArr) return [];

    return msgArr.map(function(rawMsg) {
      return {
        id: rawMsg['chat_id'],
        text: rawMsg['chat_content']
      }
    });
  }
});

module.exports = ChatBox;
