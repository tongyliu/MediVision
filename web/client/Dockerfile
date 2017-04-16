FROM node:7.9
WORKDIR /app
EXPOSE 4000
ENTRYPOINT ["node", "/app/server.js"]

RUN npm install -g gulp-cli

COPY gulpfile.js /app/
COPY server.js /app/
COPY package.json /app/
RUN npm install

COPY app /app/app

COPY public /app/public
RUN gulp
