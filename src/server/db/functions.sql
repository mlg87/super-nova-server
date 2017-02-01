-- Create a function that always returns the first non-NULL item
CREATE OR REPLACE FUNCTION public.first_agg ( anyelement, anyelement )
RETURNS anyelement LANGUAGE SQL IMMUTABLE STRICT AS $$
        SELECT $1;
$$;

-- And then wrap an aggregate around it
CREATE AGGREGATE public.FIRST (
        sfunc    = public.first_agg,
        basetype = anyelement,
        stype    = anyelement
);

-- Create a function that always returns the last non-NULL item
CREATE OR REPLACE FUNCTION public.last_agg ( anyelement, anyelement )
RETURNS anyelement LANGUAGE SQL IMMUTABLE STRICT AS $$
        SELECT $2;
$$;

-- And then wrap an aggregate around it
CREATE AGGREGATE public.LAST (
        sfunc    = public.last_agg,
        basetype = anyelement,
        stype    = anyelement
);

-- get all inventory in a formatted table, accepts a limit
DROP FUNCTION get_inventory(INT);
CREATE FUNCTION get_inventory(INT)
RETURNS TABLE (
  item_id INT,
  type VARCHAR(50),
  uuid VARCHAR(50),
  size VARCHAR(40),
  gender VARCHAR(40),
  model VARCHAR(100),
  brand VARCHAR(100),
  image_url TEXT,
  category_id INT
)
AS $$

SELECT DISTINCT
  i.id as item_id,
  it.name as type,
  i.uuid,
  s.size,
  g.inventory AS gender,
  m.name AS model,
  b.name AS brand,
  m.image_url,
  c.id AS category_id
FROM inventory i
JOIN models m ON i.model_id = m.id
JOIN item_types it ON m.item_type_id = it.id
JOIN categories c ON c.id = it.category_id
LEFT OUTER JOIN sizes s ON i.size_id = s.id
LEFT OUTER JOIN genders g ON m.gender_id = g.id
LEFT OUTER JOIN brands b ON m.brand_id = b.id
LIMIT $1
$$ LANGUAGE SQL STABLE;

-- get inventory grouped by model, accepts a starting and end dates for counting
-- available vs. unavailable gear
DROP FUNCTION get_inventory_group(INT, TSTZRANGE);
CREATE FUNCTION get_inventory_group(INT, TSTZRANGE)
RETURNS TABLE (
  model_id INT,
  type VARCHAR(50),
  gender VARCHAR(40),
  model VARCHAR(100),
  brand VARCHAR(100),
  image_url TEXT,
  available BIGINT,
  total BIGINT
)
AS $$

SELECT DISTINCT
  m.id AS model_id,
  it.name as type,
  g.inventory AS gender,
  m.name AS model,
  b.name AS brand,
  m.image_url,
  -- when reservation date_range overlaps with date_range provided, don't count it
  -- so we can present something like 2/10 available in these dates
  count(CASE WHEN r.date_range && $2 THEN null ELSE 1 END) as available,
  count(*) as total
FROM models m
JOIN inventory i ON i.model_id = m.id
JOIN item_types it ON m.item_type_id = it.id
LEFT OUTER JOIN sizes s ON i.size_id = s.id
LEFT OUTER JOIN genders g ON m.gender_id = g.id
LEFT OUTER JOIN brands b ON m.brand_id = b.id
LEFT OUTER JOIN join_reservations_inventory j ON j.item_id = i.id
LEFT OUTER JOIN reservations r ON j.reservation_id = r.id
GROUP BY m.id, type, gender, model, model_id, brand, m.image_url
LIMIT $1
$$ LANGUAGE SQL;


-- get inventory by searching through model, brand, type and tags.
-- $2 = category_id, $3 = limit
-- returns all values if TEXT = ''
DROP FUNCTION search_inventory(TEXT, INT, INT);
CREATE FUNCTION search_inventory(TEXT, INT, INT)
RETURNS TABLE (
  item_id INT,
  type VARCHAR(50),
  uuid VARCHAR(50),
  size VARCHAR(40),
  gender VARCHAR(40),
  model VARCHAR(100),
  brand VARCHAR(100),
  image_url TEXT,
  category_id INT
)
AS $$

-- we have to specify the fields again here
SELECT DISTINCT item_id, type, g.uuid, size, gender, model, brand, g.image_url, category_id FROM get_inventory(null) g
-- join inventory to get the model_id
JOIN inventory i ON i.id = item_id
JOIN models m ON m.id = i.model_id
-- get the tags, although we won't return them, for the search
LEFT OUTER JOIN join_tags_models jtm ON jtm.model_id = m.id
LEFT OUTER JOIN tags t ON jtm.tag_id = t.id
-- model and brand need to be an exact match, type and tags can be close...
-- spaces between search terms are treated with AND ('shoes kayak') will only return rows with both matching
WHERE
  ($2 = 0 OR $2 = category_id) AND
  $1 = '' OR
  model || ' '
  || brand || ' '
  || COALESCE(to_tsvector(type), ' ')
  || COALESCE(to_tsvector(gender), ' ')
  || COALESCE(to_tsvector(t.tag), ' ')
  @@ to_tsquery(REPLACE($1, ' ', ' & '))
LIMIT $3

$$ LANGUAGE SQL;

-- get inventory by searching through model, brand, type and tags.
-- Accepts a limit as a second argument.
-- returns all values if TEXT = ''
DROP FUNCTION search_inventory_group(TEXT, INT, TSTZRANGE);
CREATE FUNCTION search_inventory_group(TEXT, INT, TSTZRANGE)
RETURNS TABLE (
  type VARCHAR(50),
  gender VARCHAR(40),
  model VARCHAR(100),
  brand VARCHAR(100),
  image_url TEXT,
  available BIGINT,
  total BIGINT
)
AS $$

-- we have to specify the fields again here
SELECT DISTINCT type, gender, model, brand, image_url, available, total FROM get_inventory_group(null, $3) g
-- get the tags, although we won't return them, for the search
LEFT OUTER JOIN join_tags_models jtm ON jtm.model_id = g.model_id
LEFT OUTER JOIN tags t ON jtm.tag_id = t.id
-- model and brand need to be an exact match, type and tags can be close...
-- spaces between search terms are treated with AND ('shoes kayak') will only return rows with both matching
WHERE
  $1 = '' OR
  model || ' '
  || brand || ' '
  || COALESCE(to_tsvector(type), ' ')
  || COALESCE(to_tsvector(gender), ' ')
  || COALESCE(to_tsvector(t.tag), ' ')
  @@ to_tsquery(REPLACE($1, ' ', ' & '))
LIMIT $2

$$ LANGUAGE SQL;

-- get customers with the type, ordered by last reservation. Accepts a limit.
-- we also return last_reservation, thought it might be useful and it makes sorting easier.
-- if we don't end up using it, we can use CTE instead (WITH a temp expression)
-- returns all values if TEXT = ''
DROP FUNCTION search_customers(TEXT, INT);
CREATE FUNCTION search_customers(TEXT, INT)
RETURNS TABLE (
  id INT,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  user_id INT,
  email VARCHAR(100),
  type VARCHAR(50),
  student_id VARCHAR(50),
  phone_number CHAR(10),
  street TEXT,
  city VARCHAR(100),
  state CHAR(2),
  zip_code VARCHAR(10),
  birth_date DATE,
  last_reservation TIMESTAMPTZ,
  image_url TEXT
)
AS $$
  -- ct is in the GROUP BY, otherwise we'll have to aggregate it.
  SELECT DISTINCT
    c.id,
    c.first_name,
    c.last_name,
    c.user_id,
    c.email,
    ct.type,
    c.student_id,
    c.phone_number,
    (c.address).street,
    (c.address).city,
    (c.address).state,
    (c.address).zip_code,
    c.birth_date,
    MAX(r.created_at) as last_reservation,
    c.image_url
  FROM customers c
  JOIN customer_types ct ON c.type_id = ct.id
  LEFT OUTER JOIN reservations r ON r.customer_id = c.id
  WHERE (
    COALESCE(lower(first_name), ' ')
    || ' ' || COALESCE(lower(last_name), ' ')
    || ' ' || COALESCE(lower(email), ' ')
    || ' ' || COALESCE(phone_number, ' ')
  ) LIKE '%' || lower($1) || '%'
  GROUP BY c.id, ct.type
  ORDER BY last_reservation
  LIMIT $2
$$ LANGUAGE SQL STABLE;
