"""Stream management controllers

Here are handlers for API endpoints
"""
from datetime import datetime

from flask import Blueprint, jsonify, request

from utils.db_driver import *
from utils.utils import id_generator

stream_pages = Blueprint('stream_pages', __name__)


@stream_pages.route('/', methods=['POST'])
def create_stream():
    """
    @api {post} /stream/ Create Stream
    @apiName PostStream
    @apiGroup Stream

    @apiParam {String} stream_name Name of the new stream

    @apiSuccess {Boolean} success Indicate whether this request success
    @apiSuccess {String} stream_id Newly generated stream ID for this stream

    @apiDescription This endpoint accepts request to create new stream
    """
    stream_name = request.form.get('stream_name', '')
    stream_id = id_generator()

    conn, cur = get_cursor()

    stmt = "INSERT INTO streams (id, created_at, stream_name)" \
           "VALUES (%s, %s, %s);"
    data = (str(stream_id), datetime.utcnow(), stream_name)
    cur.execute(stmt, data)

    fin(conn, cur)

    return jsonify({'success': True, 'stream_id': stream_id})


@stream_pages.route('/<stream_id>', methods=['GET'])
def get_stream(stream_id):
    """
    @api {get} /stream/:stream_id Get Stream
    @apiName GetStreamId
    @apiGroup Stream

    @apiParam {String} stream_id Stream ID to be retrieved

    @apiSuccess {Boolean} success Indicate whether this request success
    @apiSuccess {Number} client_id Indicate which client it is contacting this live stream

    @apiDescription This endpoint returns information about requested stream
    """
    res = {'success': False}

    conn, cur = get_cursor()

    stmt = 'SElECT client_counter FROM streams WHERE id=%s;'
    cur.execute(stmt, (stream_id,))
    result = cur.fetchone()

    if result is not None:
        counter = result[0] + 1

        stmt = 'UPDATE streams SET client_counter=%s WHERE id=%s;'
        data = (str(counter), stream_id)
        cur.execute(stmt, data)

        res['success'] = True
        res['client_id'] = counter

    fin(conn, cur)

    return jsonify(res)


@stream_pages.route('/', methods=['GET'])
def get_all_streams():
    """
    @api {get} /stream/ Get All Streams
    @apiName GetStream
    @apiGroup Stream

    @apiSuccess {Boolean} success Indicate whether this request success
    @apiSuccess {String[]} active_streams A list of active stream IDs
    @apiSuccess {String[]) active_names A list of active stream names

    @apiDescription This endpoint returns a list of currently active streams with their IDs
    """
    conn, cur = get_cursor()

    stmt = "SELECT id FROM streams;"
    cur.execute(stmt)
    ids = cur.fetchall()
    stmt = "SELECT stream_name FROM streams;"
    cur.execute(stmt)
    names = cur.fetchall()

    fin(conn, cur)

    return jsonify({'success': True, 'active_streams': [i[0] for i in ids],
                    'active_names': [i[0] for i in names]})
