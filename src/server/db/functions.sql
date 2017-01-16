-- https://wiki.postgresql.org/wiki/First/last_(aggregate)
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

-- get all inventory in a formatted table, accepts a limit
CREATE OR REPLACE FUNCTION get_inventory(INT)
RETURNS TABLE (item_id INT, type VARCHAR(50), uuid VARCHAR(50), size VARCHAR(40), gender VARCHAR(40), model VARCHAR(100), brand VARCHAR(100))
AS $$

SELECT DISTINCT i.id as item_id, it.name as type, i.uuid, s.size, g.inventory AS gender, m.name AS model, b.name AS brand
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
CREATE OR REPLACE FUNCTION search_in_inventory(TEXT, INT)
RETURNS TABLE (item_id INT, type VARCHAR(50), uuid VARCHAR(50), size VARCHAR(40), gender VARCHAR(40), model VARCHAR(100), brand VARCHAR(100))
AS $$

-- we have to specify the fields again here
SELECT DISTINCT item_id, type, uuid, size, gender, model, brand FROM get_inventory(null)
-- get the tags, although we won't return them, for the search
LEFT OUTER JOIN join_tags_inventory jti ON jti.inventory_id = item_id
LEFT OUTER JOIN tags t ON jti.tag_id = t.id
-- model and brand need to be an exact match, type and tags can be close...
-- spaces between search terms are treated with AND ('shoes kayak') will only return rows with both matching
WHERE
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
CREATE OR REPLACE FUNCTION get_customers(INT)
RETURNS TABLE (
  customer_id INT,
  name VARCHAR(100),
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
  -- we use coalesce on the type because we must aggregate the value or add
  -- ct to the GROUP BY. coalesce simply returns the first non-null value.
  SELECT DISTINCT c.id, c.name, c.user_id, c.email, FIRST(ct.type), c.student_id, c.phone_number, c.address, c.birth_date, MAX(r.created_at)
  FROM customers c
  JOIN customer_types ct ON c.type_id = ct.id
  LEFT OUTER JOIN reservations r ON r.customer_id = c.id
  GROUP BY c.id
  LIMIT $1
$$ LANGUAGE SQL STABLE;
