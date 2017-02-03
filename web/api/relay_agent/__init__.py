import logging
from sys import stdout

from flask import Flask

from relay_agent.blueprints.default_controller import misc_pages

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(process)d] [%(name)s] [%(levelname)s] [%(funcName)s]"
           " [line: %(lineno)s] - %(message)s",
    stream=stdout
)

app = Flask(__name__)

api_prefix = '/api'
app.register_blueprint(misc_pages, url_prefix=api_prefix)
