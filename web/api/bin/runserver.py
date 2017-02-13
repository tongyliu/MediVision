#! /usr/bin/env python3
from relay_agent import app, socketio

if __name__ == '__main__':
    # app.run(host='0.0.0.0')
    socketio.run(app, host='0.0.0.0')
