# MediVision Web Server Deployment Instructions

The web app is made up with two different parts, API server and web app front-end. To deploy both of them using [Docker](www.docker.com), we leverage Docker Compose to synchronously. 

The overall instructions are the following:

- Compile web app code into bundle.js

    Switch to `cd ./client` directory and run `NODE_ENV=production gulp && gulp minify-js`

- Run docker-compose

    In this directory, run `docker-compose build && docker-compose down && docker-compose up -d`
