-- we delete tables in reverse order because of fk constraints
DELETE FROM customers;
DELETE FROM customer_types;
DELETE FROM users;
DELETE FROM join_brands_item_types;
DELETE FROM join_tags_inventory;
DELETE FROM inventory;
DELETE FROM tags;
DELETE FROM sizes;
DELETE FROM models;
DELETE FROM brands;
DELETE FROM item_types;
DELETE FROM size_types;
DELETE FROM categories;
-- reset the id field so it can be referenced by other tables
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
INSERT INTO categories(name) VALUES
  ('winter sports'), ('climbing'), ('water sports'), ('hiking');

ALTER SEQUENCE size_types_id_seq RESTART WITH 1;
INSERT INTO size_types(name) VALUES
  ('shirt'), ('pant'), ('shoe'), ('volume');

ALTER SEQUENCE item_types_id_seq RESTART WITH 1;
INSERT INTO item_types(name, category_id, size_type_id) VALUES
  ('kayak', 3, null), ('climbing shoe', 2, 3), ('harness', 2, 1), ('backpack', 4, 1);

ALTER SEQUENCE brands_id_seq RESTART WITH 1;
INSERT INTO brands(name) VALUES
  ('La Sportiva'), ('Five Ten'), ('Osprey'), ('Petzl'), ('Eddyline');

ALTER SEQUENCE models_id_seq RESTART WITH 1;
INSERT INTO models(name, brand_id) VALUES
  ('Miura', 1), ('Corax', 4), ('Fairpoint 40', 3), ('Aura', 5);

ALTER SEQUENCE sizes_id_seq RESTART WITH 1;
INSERT INTO sizes(size, size_type_id) VALUES
  ('Small', 1),
  ('Medium', 1),
  ('Large', 1),
  ('10', 3),
  ('10.5', 3),
  ('11', 3),
  ('45', 4),
  ('70', 4);

ALTER SEQUENCE tags_id_seq RESTART WITH 1;
INSERT INTO tags(tag) VALUES
  ('Travel'), ('Travel Pack'), ('Crack climbing'), ('Safety'), ('River');

ALTER SEQUENCE inventory_id_seq RESTART WITH 1;
INSERT INTO inventory(item_type_id, size_id, gender, model_id) VALUES
  (1, NULL, NULL, 4),
  (2, 5, 'Men''s', 1),
  (3, 2, 'Men''s', 2),
  (4, 7, 'Women''s', 3);

INSERT INTO join_tags_inventory(tag_id, inventory_id) VALUES
  (5, 1), (3, 2), (4, 3), (1, 4), (2, 4);

INSERT INTO join_brands_item_types(brand_id, item_type_id) VALUES
  (1, 1), (2, 1), (3, 4), (4, 2), (4, 4), (5, 1);

ALTER SEQUENCE users_id_seq RESTART WITH 1;
INSERT INTO users(username, password) VALUES
  ('alon01', '$2a$10$IP64aD6GTDUQvtHznWjdKOPazCiFghrh9B3TZADOnVWIF/aaXCKSG');

ALTER SEQUENCE customer_types_id_seq RESTART WITH 1;
INSERT INTO customer_types(type) VALUES
  ('Staff'), ('Student'), ('Alumni'), ('Public');

INSERT INTO customers(name, user_id, type_id) VALUES
  ('Alon Dahari', 1, 1), ('Dick Grossweiner', null, 2);
