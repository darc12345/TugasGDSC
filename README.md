starting the postgres
docker run --name GDSCAssPostgres -e POSTGRES_PASSWORD=password -d -p 5000:5432 postgres

Creating the tables, run this in psql

CREATE TABLE users(
  user_id VARCHAR,
  name TEXT,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP,
  PRIMARY KEY(user_id)
);

CREATE TYPE priorities AS ENUM ('low', 'medium', 'high');
CREATE TABLE todos(
  todo_id uuid DEFAULT gen_random_uuid(),
  user_id VARCHAR,
  title VARCHAR NOT NULL,
  description VARCHAR,
  due_date TIMESTAMP,
  priority priorities,
  is_complete BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);