# MediVision Server Implementation 

Code for the Python/Flask backend API server goes here.

## Virtual Environment
Run the following commands to create virtual environment
    
    virtualenv env
    source env/bin/activate
    
## Install Dependency
    
    pip install -e .
    
    
Setup environment variables
    
    mv settings.env.sample settings.env
    
And change correct values in `settings.env`

## Modules

- [bin](bin) All executables
- [relay_agent](relay_agent) Main entry point for API server
- [tests](tests) Test cases go here

## Run Server

    source settings.env # Load environment variables
    ./bin/runserver.py
    
Currently, the main entry point is *localhost:5000/api/*

## API Documentation

We will use [ApiDoc](http://apidocjs.com/) for API generations.

Install it with

    npm install apidoc -g
    
And then run the following in this directory
    
    ./bin/generate_api.sh
    
And then you can view the API documentation page in `apidoc/index.html`
Or by open

    open apidoc/index.html

## Deployment

The server instance is deployed on 
[Amazon EC2](https://aws.amazon.com/ec2/) via the utilization 
of [Docker](http://docker.com/). 

The current address of the running server instance is 
http://34.198.160.73/ (Only accessible though U-M networks) and
you can verify it's up by visiting http://34.198.160.73/api/ .
