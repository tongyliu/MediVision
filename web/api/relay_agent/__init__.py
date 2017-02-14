import logging
from sys import stdout

from flask import Flask
from flask_socketio import SocketIO, emit

from relay_agent.blueprints.default_controller import misc_pages
from relay_agent.blueprints.stream_controller import stream_pages

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(process)d] [%(name)s] [%(levelname)s] [%(funcName)s]"
           " [line: %(lineno)s] - %(message)s",
    stream=stdout
)

app = Flask(__name__)
socketio = SocketIO(app)

api_prefix = '/api'
socket_prefix = api_prefix + '/socket'

app.register_blueprint(misc_pages, url_prefix=api_prefix)
app.register_blueprint(stream_pages, url_prefix=api_prefix + '/stream')


# TODO: Refactor these decorators to separate file
# @socketio.on('register', namespace=socket_prefix)
# def handle_register(data):
#     emit('my response', {'data': 'Registered'})


@socketio.on('send', namespace=socket_prefix)
def handle_send(data):
    emit(data['to'], data)
