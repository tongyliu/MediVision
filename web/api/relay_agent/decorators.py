import os
from functools import wraps

import jwt
import logging
from flask import request, Response

try:
    SERVER_SECRET = os.environ['SERVER_SECRET']
except:
    raise Exception('You need to set SERVER_SECRET environment variable')


def authenticate():
    """Sends a 401 response that enables basic auth"""
    return Response(
        'Could not verify your access level for that URL.\n'
        'You have to login with proper credentials')


def check_auth():
    try:
        jwt_token = request.headers['Authorization'][len('Bearer '):]
        logging.info('Get jwt token: ' + jwt_token)
    except KeyError:
        return False

    try:
        jwt.decode(jwt_token, SERVER_SECRET, algorithms=['HS256'])
    except jwt.InvalidTokenError:
        return False

    return True


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not check_auth():
            return authenticate()
        return f(*args, **kwargs)

    return decorated
