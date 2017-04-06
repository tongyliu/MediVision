"""Routing controllers

Here are handlers for API endpoints
"""
from flask import Blueprint

from relay_agent.decorators import requires_auth

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


@misc_pages.route('/hidden', methods=['POST', 'GET'])
@requires_auth
def hidden_landing():
    """
    @api {post, get} /hidden Hidden Landing Page
    @apiName LandingPage
    @apiGroup Default

    @apiDescription This is the hidden landing page. Requires authentication.
    """
    return "Nothing special here. ;)"
