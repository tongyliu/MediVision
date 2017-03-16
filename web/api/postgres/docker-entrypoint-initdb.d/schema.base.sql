\c medivision
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table schema
CREATE TABLE streams (
  id             UUID PRIMARY KEY,
  created_at     TIMESTAMP DEFAULT (now() AT TIME ZONE 'utc'),
  stream_name    TEXT,
  client_counter INT       DEFAULT 0
);

CREATE TABLE chat (
  id         UUID PRIMARY KEY,
  stream_id  UUID REFERENCES streams (id) ON DELETE CASCADE,
  content    TEXT,
  created_at TIMESTAMP DEFAULT (now() AT TIME ZONE 'utc')
);

-- Add test accounts
INSERT INTO streams (id, stream_name) VALUES ('00000000-0000-0000-0000-000000000000', 'test_stream');
