# -*- coding: utf-8 -*-
"""Authentication controllers

Here are handlers for API endpoints

XXX Note: Authentication module is schduled for Omega release, so here it is a work in progress
"""
import datetime

import logging
import os

from flask import Blueprint, request, jsonify
import jwt
import bcrypt

from utils.db_driver import get_cursor, fin
from utils.utils import id_generator
from relay_agent.decorators import requires_auth

auth_pages = Blueprint('auth_pages', __name__)

try:
    SERVER_SECRET = os.environ['SERVER_SECRET']
except:
    raise Exception('You need to set SERVER_SECRET environment variable')


@auth_pages.route('/create', methods=['POST'])
def create_account():
    """
    @api {post} /auth/create Create Account
    @apiName CreateAccount
    @apiGroup Authentication
    
    @apiParam {String} username Username
    @apiParam {String} password Password
    @apiParam {String} name User's real name

    @apiSuccess {Boolean} success Indicate whether the user has been successfully created
    @apiSuccess {String} user_id User's UUID

    @apiDescription This endpoint allows user to create account
    """
    try:
        username = request.form['username']
        password = request.form['password']
        name = request.form.get('name', 'Anonymous')
    except KeyError:
        return jsonify({'success': False, 'detail': 'Missing username or password'})

    user_id = id_generator()
    conn, cur = get_cursor()
    salt = bcrypt.gensalt()
    logging.info(type(password))
    logging.info(type(salt))
    pw_hash = bcrypt.hashpw(password.encode('utf-8'), salt)

    stmt = "INSERT INTO users " \
           "(id, username, password, fullname)" \
           "VALUES (%s, %s, %s, %s);"
    data = (str(user_id), username, pw_hash.decode('utf-8'), name)
    cur.execute(stmt, data)

    fin(conn, cur)

    return jsonify({'success': True, 'user_id': user_id})


@auth_pages.route('/login', methods=['POST'])
def login():
    """
    @api {post} /auth/login User Login
    @apiName Login
    @apiGroup Authentication

    @apiParam {String} username Username
    @apiParam {String} password Password
    
    @apiSuccess {Boolean} success Indicate whether the user has been successfully logged in
    @apiSuccess {String} token User authentication token
    @apiSuccess {String} user_id User's UUID
    @apiSuccess {String} name User's real name

    @apiDescription This endpoint allows user to login with credentials
    """
    try:
        username = request.form['username']
        password = request.form['password']
    except KeyError:
        return jsonify({'success': False, 'detail': 'Missing username or password'})

    conn, cur = get_cursor()

    stmt = "SELECT id, password, fullname FROM users WHERE username = %s;"
    data = (username,)
    cur.execute(stmt, data)
    result = cur.fetchone()

    res = {'success': False}
    if result is not None:
        user_id = result[0]
        pw_hash = result[1]
        name = result[2]

        if bcrypt.checkpw(password.encode('utf-8'), pw_hash.encode('utf-8')):
            res['success'] = True
            res['token'] = jwt.encode({'user_id': user_id,
                                       'iat': datetime.datetime.utcnow(),
                                       'exp': datetime.datetime.utcnow() + datetime.timedelta(
                                           minutes=30)},
                                      SERVER_SECRET, algorithm='HS256').decode('utf-8')
            res['user_id'] = user_id
            res['name'] = name

    fin(conn, cur)
    return jsonify(res)


@auth_pages.route('/logout', methods=['POST'])
@requires_auth
def logout():
    """
    @api {post} /auth/logout User Logout
    @apiName Logout
    @apiGroup Authentication

    @apiParam {String} user_id User's ID

    @apiSuccess {Boolean} success Indicate whether the user can log himself out

    @apiDescription This endpoint allows user to logout current user   
    """
    res = {'success': False}

    try:
        victim_id = request.form['user_id']
    except KeyError:
        res['detail'] = 'Missing user_id'
        return jsonify(res)

    try:
        jwt_token = request.headers['Authorization'][len('Bearer '):]
        logging.info('Get jwt token: ' + jwt_token)
    except KeyError:
        res['detail'] = 'Invalid Authorization header'
        return jsonify(res)

    try:
        payload = jwt.decode(jwt_token, SERVER_SECRET, algorithms=['HS256'])
    except jwt.InvalidTokenError:
        res['detail'] = 'Invalid token'
        return jsonify(res)

    if payload['user_id'] != victim_id:
        res['detail'] = 'Incorrect user id. You can\'t log someone else out'
        return jsonify(res)

    res['success'] = True
    return jsonify(res)
