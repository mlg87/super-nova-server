DELETE FROM categories;
-- reset the id field so it can be referenced by other tables
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
INSERT INTO categories(name) VALUES
  ('winter sports'), ('climbing'), ('water sports'), ('hiking');

DELETE FROM size_types;
ALTER SEQUENCE size_types_id_seq RESTART WITH 1;
INSERT INTO size_types(name) VALUES
  ('shirt'), ('pant'), ('shoe');

DELETE FROM item_types;
ALTER SEQUENCE item_types_id_seq RESTART WITH 1;
INSERT INTO item_types(name, category_id, size_type_id) VALUES
  ('kayak', 3, null), ('climbing shoe', 2, 3), ('harness', 2, 1), ('backpack', 4, 1);

DELETE FROM brands;
ALTER SEQUENCE brands_id_seq RESTART WITH 1;
INSERT INTO brands(name) VALUES
  ('La Sportiva'), ('Five Ten'), ('Osprey'), ('Petzl');

DELETE FROM models;
ALTER SEQUENCE models_id_seq RESTART WITH 1;
INSERT INTO models(name, brand_id) VALUES
  ('Miura', 1), ('Corax', 4), ('Fairpoint 40', 3);

DELETE FROM sizes;
ALTER SEQUENCE sizes_id_seq RESTART WITH 1;
INSERT INTO sizes(size, size_type_id) VALUES
  ('Small', 1), ('Medium', 1), ('Large', 1), ('10', 3), ('10.5', 3), ('11', 3);

DELETE FROM tags;
ALTER SEQUENCE tags_id_seq RESTART WITH 1;
INSERT INTO tags(tag) VALUES
  ('Travel'), ('Travel Pack'), ('Crack climbing'), ('Safety');

DELETE FROM inventory;
INSERT INTO inventory(item_type_id, size_id, gender, brand_id, model_id) VALUES
  (1, NULL, NULL),
  (2, '41', 'La Sportiva Miura'),
  (3, 'medium', 'Arctery`x');

DELETE FROM users;
INSERT INTO users(username, password) VALUES
  ('alon01', '$2a$10$IP64aD6GTDUQvtHznWjdKOPazCiFghrh9B3TZADOnVWIF/aaXCKSG')
