"""Chat logs controllers

Here are handlers for API endpoints
"""
import logging
from flask import Blueprint, request, jsonify
from utils.db_driver import get_cursor, fin
from time import mktime

"""
@api {OBJECT} Chat Chat
@apiGroup Custom types
@apiParam {String} chat_id Chat message UUID.
@apiParam {String} chat_content Chat message content.
@apiParam {Timestamp} chat_created_at Timestamp this message is created at.
"""

chat_pages = Blueprint('chat_pages', __name__)


@chat_pages.route('/<stream_id>', methods=['GET'])
def get_history(stream_id):
    """
    @api {get} /chat/:stream_id Get Chat History
    @apiName GetChatHistory
    @apiGroup Chat

    @apiParam {String=['true', 'false']} viewer_only If this is viewer-viewer chat, it must be TRUE. If it is
    viewer-streamer chat, set it to be FALSE.
    @apiParam {String} stream_id Stream ID

    @apiSuccess {Boolean} success Indicate whether this request success
    @apiSuccess {[Chat](#api-Custom_types-ObjectChat)[]} chat_messages Entire history of chatting

    @apiDescription This endpoint fetches all chat history for a specific stream
    """
    logging.info('Receive request for /chat/' + stream_id)
    viewer = request.args.get('viewer_only', '')
    if viewer == 'true':
        viewer = True
    elif viewer == 'false':
        viewer = False
    else:
        return jsonify({'success': False})

    stmt = "SELECT id, content, created_at FROM chat WHERE stream_id = %s AND viewer_chat = %s;"
    data = (stream_id, viewer)
    conn, cur = get_cursor()
    cur.execute(stmt, data)
    results = cur.fetchall()
    fin(conn, cur)

    messages = [{'chat_id': i[0], 'chat_content': i[1], 'chat_created_at': mktime(i[2].timetuple())}
                for i in results]

    response = {'success': True, 'chat_messages': messages}
    logging.info('Response for /chat/' + stream_id + ': ' + str(response))

    return jsonify(response)
