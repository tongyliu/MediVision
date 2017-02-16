#
# (c) 2017, MediVision
#
# setup.py
#

from setuptools import setup

setup(
    name='MediVision-Server',
    version='0.0.1',
    description="central server for video stream coordination",
    author='han',
    author_email='hazh@umich.edu',
    test_suite='tests',
    packages=[
        'relay_agent',
        'firebase_db',
    ],
    install_requires=[
        'flask==0.12',
        'flask-socketio==2.8.3',
        'flask-cors==3.0.2',
    ]
)
