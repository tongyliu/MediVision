CREATE USER python WITH PASSWORD 'python';
CREATE DATABASE medivision;
GRANT ALL PRIVILEGES ON DATABASE medivision TO python;
ALTER USER python WITH SUPERUSER;
