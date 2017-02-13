# MediVision Server Implementation 

Code for the Python/Flask backend API server goes here.

## Virtual Environment
Run the following commands to create virtual environment
    
    virtualenv env
    source env/bin/activate
    
## Install Dependency
    
    pip install -e .
    
## Modules

- [bin](bin) All executables
- [relay_agent](relay_agent) Main entry point for API server
- [tests](tests) Test cases go here

## Run Server

    ./bin/runserver.py
    
Currently, the main entry point is *localhost:5000/api/*

## API Documentation

We will use [ApiDoc](http://apidocjs.com/) for API generations.

Install it with

    npm install apidoc -g
    
And then run the following 
    
    apidoc -i ./ -o apidoc/
    
And then you can view the API documentation page in `apidoc/index.html`
Or by open

    open apidoc/index.html
