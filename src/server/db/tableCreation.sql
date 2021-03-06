-- import gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- for now we just drop everything so we don't have to keep track of what we altered.
-- drop in reverse order because of dependencies.
DROP TABLE join_reservations_inventory;
DROP TABLE reservations;
DROP TABLE customers;
DROP TABLE customer_types;
DROP TABLE users;
DROP TABLE join_tags_models;
DROP TABLE join_brands_item_types;
DROP TABLE inventory;
DROP TABLE tags;
DROP TABLE sizes;
DROP TABLE models;
DROP TABLE brands;
DROP TABLE item_types;
DROP TABLE size_types;
DROP TABLE categories;
DROP TABLE genders;
-- CASCADE drops anything that has address in it.
DROP TYPE address CASCADE;

CREATE TYPE address AS (
  street TEXT,
  city VARCHAR(100),
  state CHAR(2),
  zip_code VARCHAR(10)
);

CREATE TABLE genders (
  id SERIAL PRIMARY KEY,
  customer VARCHAR(40),
  inventory VARCHAR(40)
);

-- inventory categories, e.g. 'climbing'
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- list the types of sizes we have - shirt sizes, pants sizes, shoe sizes...
CREATE TABLE size_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  -- general item type description.
  description TEXT,
  category_id INT REFERENCES categories(id),
  size_type_id INT REFERENCES size_types(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  item_type_id INT REFERENCES item_types(id) NOT NULL,
  brand_id INT REFERENCES brands(id),
  -- gender can be null
  gender_id INT REFERENCES genders(id),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, brand_id)
);

CREATE TABLE sizes (
  id SERIAL PRIMARY KEY,
  size VARCHAR(40) NOT NULL,
  size_type_id INT REFERENCES size_types(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(size, size_type_id)
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  tag VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  -- item description, will inherit from the item type if null.
  description TEXT,
  uuid VARCHAR(50) NOT NULL UNIQUE,
  size_id INT REFERENCES sizes(id),
  -- ASSUMES every model must have a brand
  model_id INT REFERENCES models(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE join_tags_models (
  tag_id INT NOT NULL REFERENCES tags(id),
  model_id INT NOT NULL REFERENCES inventory(id)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  -- add roles in the future
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_types (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  user_id INT REFERENCES users(id),
  email VARCHAR(100) UNIQUE,
  -- student, alumni, etc.
  type_id INT NOT NULL REFERENCES customer_types(id),
  gender_id INT REFERENCES genders(id),
  student_id VARCHAR(50) UNIQUE,
  phone_number CHAR(10) UNIQUE CHECK(phone_number ~ '[0-9]{10}'),
  address ADDRESS,
  birth_date DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id) NOT NULL,
  user_id INT REFERENCES users(id) NOT NULL,
  date_range TSTZRANGE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE join_reservations_inventory (
  reservation_id INT NOT NULL REFERENCES reservations(id),
  item_id INT NOT NULL REFERENCES inventory(id)
);


-- Create a trigger function that takes no arguments.
-- Trigger functions automatically have OLD, NEW records
-- and TG_TABLE_NAME as well as others.
CREATE OR REPLACE FUNCTION generate_uuid()
RETURNS TRIGGER AS $$

 -- Declare the variables we'll be using.
DECLARE
  key TEXT;
  found TEXT;
BEGIN

  -- This loop will probably only run once per call until we've generated
  -- millions of ids.
  LOOP

    -- Generate our string bytes and re-encode as a base64 string.
    key := encode(gen_random_bytes(6), 'base64');

    -- Concat the generated key (safely quoted) with the generated query
    -- and run it.
    -- SELECT id FROM "test" WHERE id='blahblah' INTO found
    -- Now "found" will be the duplicated id or NULL.
    EXECUTE 'SELECT uuid FROM inventory WHERE uuid=' || quote_literal(key) INTO found;

    -- Check to see if found is NULL.
    -- If we checked to see if found = NULL it would always be FALSE
    -- because (NULL = NULL) is always FALSE.
    IF found IS NULL THEN

      -- If we didn't find a collision then leave the LOOP.
      EXIT;
    END IF;

    -- We haven't EXITed yet, so return to the top of the LOOP
    -- and try again.
  END LOOP;

  -- NEW and OLD are available in TRIGGER PROCEDURES.
  -- NEW is the mutated row that will actually be INSERTed.
  -- We're replacing id, regardless of what it was before
  -- with our key variable.
  NEW.uuid = key;

  -- The RECORD returned here is what will actually be INSERTed,
  -- or what the next trigger will get if there is one.
  RETURN NEW;
END;
$$ language 'plpgsql';

-- If an INSERT contains multiple RECORDs, each one will call
-- unique_short_id individually.
CREATE TRIGGER gen_uuid_if_null
  BEFORE INSERT ON inventory
  FOR EACH ROW
  WHEN (NEW.uuid IS NULL)
  EXECUTE PROCEDURE generate_uuid();
