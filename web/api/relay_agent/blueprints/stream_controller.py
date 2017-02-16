"""Stream management controllers

Here are handlers for API endpoints
"""
from datetime import datetime

from flask import Blueprint, jsonify

from utils import id_generator

stream_pages = Blueprint('stream_pages', __name__)

# Temporary solution. Will move to DB later. Firebase doesn't work
streams = {}


@stream_pages.route('/', methods=['POST'])
def create_stream():
    """
    @api {post} /api/stream/ Create Stream
    @apiName PostStream
    @apiGroup Stream

    @apiSuccess {Boolean} success Indicate whether this request success
    @apiSuccess {String} stream_id Newly generated stream ID for this stream

    @apiDescription This endpoint accepts request to create new stream
    """
    stream_id = id_generator()
    streams[stream_id] = 0
    return jsonify({'success': True, 'stream_id': stream_id})


@stream_pages.route('/<stream_id>', methods=['GET'])
def get_stream(stream_id):
    """
    @api {get} /api/stream/:stream_id Get Stream
    @apiName GetStreamId
    @apiGroup Stream

    @apiParam {String} stream_id Stream ID to be retrieved

    @apiSuccess {Boolean} success Indicate whether this request success
    @apiSuccess {Number} client_id Indicate which client it is contacting this live stream

    @apiDescription This endpoint returns information about requested stream
    """
    res = {'success': False}
    if stream_id in streams:
        res['success'] = True
        res['client_id'] = streams[stream_id]
        streams[stream_id] += 1
    return jsonify(res)


@stream_pages.route('/', methods=['GET'])
def get_all_streams():
    """
    @api {get} /api/stream/ Get All Streams
    @apiName GetStream
    @apiGroup Stream

    @apiSuccess {Boolean} success Indicate whether this request success
    @apiSuccess {String[]} active_streams A list of active streams

    @apiDescription This endpoint returns a list of currently active streams with their IDs
    """
    return jsonify({'success': True, 'active_streams': list(streams)})
