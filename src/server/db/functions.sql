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
  image_url TEXT
)
AS $$

SELECT DISTINCT i.id as item_id, it.name as type, i.uuid, s.size, g.inventory AS gender, m.name AS model, b.name AS brand, i.image_url
FROM inventory i
JOIN item_types it ON i.item_type_id = it.id
LEFT OUTER JOIN sizes s ON i.size_id = s.id
LEFT OUTER JOIN genders g ON i.gender_id = g.id
LEFT OUTER JOIN models m ON i.model_id = m.id
LEFT OUTER JOIN brands b ON m.brand_id = b.id
LIMIT $1
$$ LANGUAGE SQL STABLE;


-- get inventory by searching through model, brand, type and tags.
-- Accepts a limit as a second argument.
-- returns all values if TEXT = ''
DROP FUNCTION search_inventory(TEXT, INT);
CREATE FUNCTION search_inventory(TEXT, INT)
RETURNS TABLE (
  item_id INT,
  type VARCHAR(50),
  uuid VARCHAR(50),
  size VARCHAR(40),
  gender VARCHAR(40),
  model VARCHAR(100),
  brand VARCHAR(100),
  image_url TEXT
)
AS $$

-- we have to specify the fields again here
SELECT DISTINCT item_id, type, uuid, size, gender, model, brand, image_url FROM get_inventory(null)
-- get the tags, although we won't return them, for the search
LEFT OUTER JOIN join_tags_inventory jti ON jti.inventory_id = item_id
LEFT OUTER JOIN tags t ON jti.tag_id = t.id
-- model and brand need to be an exact match, type and tags can be close...
-- spaces between search terms are treated with AND ('shoes kayak') will only return rows with both matching
WHERE
  $1 = '' OR
  model || ' '
  || brand || ' '
  || to_tsvector(type)
  || to_tsvector(gender)
  || to_tsvector(t.tag)
  @@ to_tsquery(REPLACE($1, ' ', ' & '))
LIMIT $2

$$ LANGUAGE SQL STABLE;

-- get customers with the type, ordered by last reservation. Accepts a limit.
-- we also return last_reservation, thought it might be useful and it makes sorting easier.
-- if we don't end up using it, we can use CTE instead (WITH a temp expression)
-- returns all values if TEXT = ''
DROP FUNCTION search_customers(TEXT, INT);
CREATE FUNCTION search_customers(TEXT, INT)
RETURNS TABLE (
  customer_id INT,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  user_id INT,
  email VARCHAR(100),
  type VARCHAR(50),
  student_id VARCHAR(50),
  phone_number CHAR(10),
  address ADDRESS,
  birth_date DATE,
  last_reservation TIMESTAMPTZ
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
    c.address,
    c.birth_date,
    MAX(r.created_at) as last_reservation
  FROM customers c
  JOIN customer_types ct ON c.type_id = ct.id
  LEFT OUTER JOIN reservations r ON r.customer_id = c.id
  WHERE $1 = '' OR lower($1) IN (lower(first_name), lower(last_name), lower(email), phone_number)
  GROUP BY c.id, ct.type
  ORDER BY last_reservation
  LIMIT $2
$$ LANGUAGE SQL STABLE;
