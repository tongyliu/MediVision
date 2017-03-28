"""Authentication controllers

Here are handlers for API endpoints
"""
from flask import Blueprint
import os

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

    @apiDescription This endpoint allows user to create account
    """
    return "Hello World!"


@auth_pages.route('/login', methods=['POST'])
def login():
    """
    @api {post} /auth/login User Login
    @apiName Login
    @apiGroup Authentication

    @apiDescription This endpoint allows user to login with credentials
    """
    return "Hello World!"


@auth_pages.route('/logout', methods=['POST'])
def logout():
    """
    @api {post} /auth/logout User Logout
    @apiName Logout
    @apiGroup Authentication

    @apiDescription This endpoint allows user to logout current user   
    """
    return "Hello World!"
