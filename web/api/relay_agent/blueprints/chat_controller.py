"""Chat logs controllers

Here are handlers for API endpoints
"""
from flask import Blueprint, request

"""
@api {OBJECT} Chat Chat
@apiGroup Custom types
@apiParam {String} chat_id Chat message UUID.
@apiParam {String} chat_content Chat message content.
@apiParam {String} chat_created_at Timestamp this message is created at.
"""

chat_pages = Blueprint('chat_pages', __name__)


@chat_pages.route('/<stream_id>', methods=['GET'])
def get_history(stream_id):
    """
    @api {get} /chat/:stream_id Get Chat History
    @apiName GetChatHistory
    @apiGroup Chat

    @apiParam {Boolean} viewer_only If this is viewer-viewer chat, it must be TRUE. If it is
    viewer-streamer chat, set it to be FALSE.
    @apiParam {String} stream_id Stream ID

    @apiSuccess {Boolean} success Indicate whether this request success
    @apiSuccess {[Chat](#api-Custom_types-ObjectChat)[]} chat_messages Entire history of chatting

    @apiDescription This endpoint
    """
    viewer = request.form.get('viewer_only', None)
    if viewer is None:
        return
    return "Hello World!"
