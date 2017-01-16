CREATE OR REPLACE FUNCTION search_in_inventory(TEXT)
RETURNS TABLE (item_id INT, type VARCHAR(50), uuid VARCHAR(50), size VARCHAR(40), gender GENDER, model VARCHAR(100), brand VARCHAR(100))
AS $$
SELECT i.id as item_id, it.name as type, i.uuid, s.size, gender, m.name AS model, b.name AS brand
FROM inventory i
JOIN item_types it ON i.item_type_id = it.id
LEFT OUTER JOIN sizes s ON i.size_id = s.id
LEFT OUTER JOIN models m ON i.model_id = m.id
LEFT OUTER JOIN brands b ON m.brand_id = b.id
LEFT OUTER JOIN join_tags_inventory jti ON jti.inventory_id = i.id
LEFT OUTER JOIN tags t ON jti.tag_id = t.id

WHERE m.name = $1 OR b.name = $1 OR it.name = $1 OR t.tag = $1;
$$ LANGUAGE SQL;
