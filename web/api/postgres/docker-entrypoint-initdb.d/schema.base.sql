\c medivision
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table schema
CREATE TABLE streams (
  id             UUID PRIMARY KEY,  -- Active stream ID
  created_at     TIMESTAMP DEFAULT (now() AT TIME ZONE 'utc'),
  stream_name    TEXT,
  client_counter INT       DEFAULT 0, -- Count how many viewers joined
  streamer_ip    TEXT,  -- Streamer's IP address
  stream_desc    TEXT -- Stream description
);

CREATE TABLE chat (
  id          UUID PRIMARY KEY, -- Chat ID
  stream_id   UUID REFERENCES streams (id) ON DELETE CASCADE, -- Chat room number
  content     TEXT, -- Actual message of this chat
  created_at  TIMESTAMP DEFAULT (now() AT TIME ZONE 'utc'),
  viewer_chat BOOL  -- Whether this chat msg is viewer-viewer chat or doctor-viewer chat
);

-- Add test accounts
INSERT INTO streams (id, stream_name, streamer_ip)
VALUES ('00000000-0000-0000-0000-000000000000', 'test_stream', '10.0.0.1');
