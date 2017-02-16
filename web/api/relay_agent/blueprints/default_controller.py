"""Routing controllers

Here are handlers for API endpoints
"""
from flask import Blueprint

misc_pages = Blueprint('misc_pages', __name__)


@misc_pages.route('/', methods=['POST', 'GET'])
def default_landing():
    """
    @api {post, get} / Landing Page
    @apiName LandingPage
    @apiGroup Default

    @apiDescription This is the default landing page.
    """
    return "Hello World!"
