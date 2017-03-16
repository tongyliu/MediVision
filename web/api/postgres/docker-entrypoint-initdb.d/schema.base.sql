\c medivision
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table schema
CREATE TABLE streams (
  id             UUID PRIMARY KEY,
  created_at     TIMESTAMP,
  stream_name    TEXT,
  client_counter INT DEFAULT 0
);
