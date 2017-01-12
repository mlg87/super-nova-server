-- import gen_random_uuid
CREATE EXTENSION pgcrypto;

CREATE TYPE address AS (
  street TEXT,
  state CHAR(2),
  country VARCHAR(50),
  zip_code VARCHAR(10)
);

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  time_zone VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  client_id INT REFERENCES clients(id) NOT NULL,
  UNIQUE(name, client_id)
);

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  sku VARCHAR(50) NOT NULL DEFAULT gen_random_uuid(),
  category_id INT REFERENCES categories(id),

  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  client_id INT REFERENCES clients(id) NOT NULL,
  UNIQUE(sku, client_id)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  -- add roles in the future
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  client_id INT REFERENCES clients(id) NOT NULL
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  user_id INT REFERENCES users(id),
  email VARCHAR(50) UNIQUE,
  -- student, alumni, etc.
  type VARCHAR(30) NOT NULL,
  student_id VARCHAR(50) UNIQUE,
  phone_number CHAR(10) UNIQUE CHECK(phone_number ~ '[0-9]{10}'),
  address ADDRESS,
  birth_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  client_id INT REFERENCES clients(id) NOT NULL
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  inventory_id INT REFERENCES inventory(id) NOT NULL,
  customer_id INT REFERENCES customers(id) NOT NULL,
  user_id INT REFERENCES users(id) NOT NULL,
  start_timestamp TIMESTAMPTZ NOT NULL,
  end_timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  client_id INT REFERENCES clients(id) NOT NULL
);

-- Below is a function and trigger to set the sku of an inventory item to the id
-- if it wasn't set.
-- CREATE OR REPLACE FUNCTION set_sku_to_id() RETURNS TRIGGER AS $$
--   BEGIN
--     UPDATE inventory SET sku=CONCAT('#', NEW.id) WHERE id=NEW.id;
--     RETURN NULL;
--   END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER set_default_sku
--   AFTER INSERT ON inventory
--   FOR EACH ROW
--   WHEN (NEW.sku IS NULL)
--   EXECUTE PROCEDURE set_sku_to_id();
