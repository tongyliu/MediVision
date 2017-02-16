#! /usr/bin/env python3
import os
from relay_agent import app, socketio

if __name__ == '__main__':
    # app.run(host='0.0.0.0')
    hostname = os.getenv('APP_HOST', '0.0.0.0')
    port = os.getenv('APP_PORT', '5000')
    socketio.run(app, host=hostname, port=port)
