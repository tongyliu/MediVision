import logging
import os
from sys import stdout

from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit

from relay_agent.blueprints.auth_controller import auth_pages
from relay_agent.blueprints.chat_controller import chat_pages
from relay_agent.blueprints.default_controller import misc_pages
from relay_agent.blueprints.stream_controller import stream_pages
from utils.db_driver import get_cursor, fin
from utils.utils import id_generator

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(process)d] [%(name)s] [%(levelname)s] [%(funcName)s]"
           " [line: %(lineno)s] - %(message)s",
    stream=stdout
)

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
socketio = SocketIO(app, engineio_logger=False, logger=False)

api_prefix = '/api'
socket_prefix = api_prefix + '/socket'

app.register_blueprint(misc_pages, url_prefix=api_prefix)
app.register_blueprint(stream_pages, url_prefix=api_prefix + '/stream')
app.register_blueprint(chat_pages, url_prefix=api_prefix + '/chat')
app.register_blueprint(auth_pages, url_prefix=api_prefix + '/auth')


# TODO: Refactor these decorators to separate file
@socketio.on('send', namespace=socket_prefix)
def handle_send(data):
    emit(data['to'], data, broadcast=True)


@socketio.on('chat', namespace=socket_prefix)
def handle_chat(msg):
    """Incoming message format:
        - to:
        - text:
        - id:
    """
    # Store in DB
    logging.info('Receive chat message: {to: %s, text: %s}' % (msg['to'], msg['text']))
    msg_id = id_generator()
    msg['id'] = str(msg_id)
    stream_id = msg['to'][:36]
    sender = msg['from']
    viewer_chat = 'viewer' in msg['to']

    stmt = 'INSERT INTO chat (id, stream_id, content, viewer_chat, sender) ' \
           'VALUES (%s, %s, %s, %s, %s);'
    data = (str(msg_id), stream_id, msg['text'], viewer_chat, sender)
    conn, cur = get_cursor()
    cur.execute(stmt, data)
    fin(conn, cur)

    emit(msg['to'], msg, broadcast=True)
