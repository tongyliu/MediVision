FROM python:3.5
MAINTAINER Han Zhang "hazh@umich.edu"

WORKDIR /app
# Installing uwsgi
RUN pip install uwsgi
EXPOSE 5000
ENTRYPOINT ["/app/bin/runserver.py"]

# Copy all project files
COPY tests /app/tests
COPY bin /app/bin
COPY setup.py /app/
COPY utils /app/utils
COPY relay_agent /app/relay_agent

# Install dependency
RUN pip install -e .
