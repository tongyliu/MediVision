"""Stream management controllers

Here are handlers for API endpoints
"""
from datetime import datetime

import logging
from flask import Blueprint, jsonify, request

from relay_agent.decorators import requires_auth
from utils.db_driver import get_cursor, fin
from utils.utils import id_generator

"""
@api {OBJECT} Stream Stream
@apiGroup Custom types
@apiParam {String} stream_id Stream UUID.
@apiParam {String} stream_name Stream name.
@apiParam {String} stream_short_desc Stream short description.
@apiParam {String} stream_full_desc Stream full version of description.
"""

stream_pages = Blueprint('stream_pages', __name__)


@stream_pages.before_request
@requires_auth
def auth_protect():
    return


@stream_pages.route('/', methods=['POST'])
def create_stream():
    """
    @api {post} /stream/ Create Stream
    @apiName PostStream
    @apiGroup Stream

    @apiParam {String} stream_name Name of the new stream
    @apiParam {String} stream_short_desc Short description of the new stream. AKA tag line
    @apiParam {String} stream_full_desc Detailed description of the new stream
    @apiParam {String} stream_ip IP address of the streamer

    @apiSuccess {Boolean} success Indicate whether this request success
    @apiSuccess {String} stream_id Newly generated stream ID for this stream

    @apiDescription This endpoint accepts request to create new stream
    """
    stream_name = request.form.get('stream_name', 'Untitled')
    stream_desc = request.form.get('stream_full_desc', '')
    stream_short = request.form.get('stream_short_desc', '')
    stream_id = id_generator()
    streamer_ip = request.form.get('stream_ip', '')

    if streamer_ip == '':
        return jsonify({
            'success': False,
            'reason': 'Need a valid stream_ip'
        })

    conn, cur = get_cursor()

    stmt = "INSERT INTO streams " \
           "(id, created_at, stream_name, streamer_ip, stream_desc, stream_short)" \
           "VALUES (%s, %s, %s, %s, %s, %s);"
    data = (str(stream_id), datetime.utcnow(), stream_name, streamer_ip, stream_desc,
            stream_short,)
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
     @apiSuccess {Boolean} is_active Indicate whether this stream is active
    @apiSuccess {[Stream](#api-Custom_types-ObjectStream)} stream Detail information about the stream.

    @apiDescription This endpoint returns information about requested stream
    """
    res = {'success': False}

    conn, cur = get_cursor()

    stmt = 'SELECT client_counter, stream_name, stream_short, stream_desc, active FROM streams ' \
           'WHERE id=%s;'
    cur.execute(stmt, (stream_id,))
    result = cur.fetchone()

    if result is not None:
        counter = result[0] + 1

        stmt = 'UPDATE streams SET client_counter=%s WHERE id=%s;'
        data = (str(counter), stream_id)
        cur.execute(stmt, data)

        res['success'] = True
        res['client_id'] = counter
        res['stream'] = {'stream_id': stream_id, 'stream_name': result[1],
                         'stream_short_desc': result[2], 'stream_full_desc': result[3]}
        res['is_active'] = result[4]

    fin(conn, cur)

    return jsonify(res)


@stream_pages.route('/', methods=['GET'])
def get_all_streams():
    """
    @api {get} /stream/ Get All Streams
    @apiName GetStream
    @apiGroup Stream

    @apiSuccess {Boolean} success Indicate whether this request success
    @apiSuccess {[Stream](#api-Custom_types-ObjectStream)[]} active_streams Streams that are
    currently online

    @apiDescription This endpoint returns a list of currently active streams with their IDs
    """
    conn, cur = get_cursor()

    stmt = "SELECT id, stream_name, stream_short, stream_desc, active FROM streams " \
           "WHERE active = TRUE;"
    cur.execute(stmt)
    results = cur.fetchall()
    fin(conn, cur)

    active_streams = [{'stream_id': i[0], 'stream_name': i[1], 'stream_short_desc': i[2],
                       'stream_full_desc': i[3]} for i in
                      results if i[4]]

    return jsonify({'success': True, 'active_streams': active_streams})


@stream_pages.route('/query/<ip_addr>', methods=['GET'])
def query_by_ip(ip_addr):
    """
     @api {get} /stream/query/:streamer_ip Get Stream ID by IP
     @apiName GetStreamIdByIp
     @apiGroup Stream

     @apiParam {String} streamer_ip Streamer IP address to be queried

     @apiSuccess {String} stream_id Corresponding Stream ID with that IP address
     @apiSuccess {Boolean} is_active Indicate whether this stream is active
     @apiSuccess {Boolean} success Indicate whether this request success

     @apiDescription This endpoint takes an IP as a query parameter. It looks up in the database
     about associated active stream. Returns the stream ID.
     """
    logging.info('Receive request for /stream/query/' + ip_addr)
    conn, cur = get_cursor()

    stmt = "SELECT id, active FROM streams WHERE streamer_ip = %s ORDER BY created_at DESC LIMIT 1;"
    data = (ip_addr,)
    cur.execute(stmt, data)
    result = cur.fetchone()
    if result is not None:
        response = {'success': True, 'stream_id': result[0], 'is_active': result[1]}
    else:
        response = {'success': False}

    fin(conn, cur)

    logging.info('Response for /stream/query/' + ip_addr + ': ' + str(response))

    return jsonify(response)


@stream_pages.route('/<stream_id>', methods=['DELETE'])
def delete_stream(stream_id):
    """
    @api {delete} /stream/:stream_id Delete Stream
    @apiName DeleteStream
    @apiGroup Stream

    @apiParam {String} stream_id Stream ID to be deleted

    @apiSuccess {Boolean} success Indicate whether this request success

    @apiDescription This endpoint deletes one specific stream upon request
    :param stream_id:
    :return:
    """
    conn, cur = get_cursor()

    """TODO: Input validation"""
    stmt = "UPDATE streams SET active = FALSE WHERE id = %s"
    data = (stream_id,)
    cur.execute(stmt, data)

    fin(conn, cur)
    return jsonify({'success': True})


@stream_pages.route('/activate/<stream_id>', methods=['GET', 'PUT'])
def activate_stream(stream_id):
    """
    @api {get, put} /stream/activate/:stream_id Activate Stream
    @apiName ActivateStream
    @apiGroup Stream
    
    @apiParam {String} stream_id Stream ID to be activated
    
    @apiSuccess {Boolean} success  Indicate whether this request success

    @apiDescription This endpoint updates one specific stream
    :param stream_id: 
    :return: 
    """
    conn, cur = get_cursor()
    stmt = "UPDATE streams SET active = TRUE WHERE id = %s;"
    data = (stream_id,)
    cur.execute(stmt, data)

    fin(conn, cur)
    return jsonify({'success': True})
