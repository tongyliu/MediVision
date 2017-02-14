"""Stream management controllers

Here are handlers for API endpoints
"""
from flask import Blueprint

stream_pages = Blueprint('stream_pages', __name__)


@stream_pages.route('/', methods=['POST'])
def create_stream():
    """
    @api {post} /api/stream/ Create Stream
    @apiName PostStream
    @apiGroup Stream

    @apiDescription This endpoint accepts request to create new stream
    """
    return "Hello World!"


@stream_pages.route('/', methods=['GET'])
def get_stream():
    """
    @api {get} /api/stream/:id Get Stream
    @apiName GetStream
    @apiGroup Stream

    @apiDescription This endpoint returns information about requested stream
    """
    return "Hello World!"
