DELETE FROM clients;
-- reset the id field so it can be referenced by other tables
ALTER SEQUENCE clients_id_seq RESTART WITH 1;
INSERT INTO clients(name, time_zone) VALUES('Grand Junction', 'US/Mountain');

DELETE FROM categories;
-- reset the id field so it can be referenced by other tables
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
INSERT INTO categories(name, client_id) VALUES
  ('winter sports', 1), ('climbing', 1), ('water sports', 1), ('hiking', 1);

DELETE FROM size_types;
ALTER SEQUENCE size_types_id_seq RESTART WITH 1;
INSERT INTO size_types(name, client_id) VALUES
  ('shirt', 1), ('pant', 1), ('shoe', 1);

DELETE FROM item_types;
ALTER SEQUENCE item_types_id_seq RESTART WITH 1;
INSERT INTO item_types(name, category_id, size_type_id, client_id) VALUES
  ('kayak', 3, null, 1), ('climbing shoe', 2, 3, 1), ('harness', 2, 1, 1), ('backpack', 4, 1, 1);

DELETE FROM brands;
ALTER SEQUENCE brands_id_seq RESTART WITH 1;
INSERT INTO brands(name, client_id) VALUES
  ('La Sportiva', 1), ('Five Ten', 1), ('Osprey', 1), ('Petzl', 1);

DELETE FROM models;
ALTER SEQUENCE models_id_seq RESTART WITH 1;
INSERT INTO models(name, brand_id, client_id) VALUES
  ('Miura', 1, 1), ('Corax', 4, 1), ('Fairpoint 40', 3, 1);

DELETE FROM sizes;
ALTER SEQUENCE sizes_id_seq RESTART WITH 1;
INSERT INTO sizes(size, size_type_id, client_id) VALUES
  ('Small', 1, 1), ('Medium', 1, 1), ('Large', 1, 1), ('10', 3, 1), ('10.5', 3, 1), ('11', 3, 1);

DELETE FROM tags;
ALTER SEQUENCE tags_id_seq RESTART WITH 1;
INSERT INTO tags(tag, client_id) VALUES
  ('Travel'), ('Travel Pack'), ('Crack climbing'), ('Safety');

DELETE FROM inventory;
INSERT INTO inventory(item_type_id, size_id, gender, brand_id, model_id, client_id) VALUES
  (1, NULL, NULL, 1),
  (2, '41', 'La Sportiva Miura', 1),
  (3, 'medium', 'Arctery`x', 1);

DELETE FROM users;
INSERT INTO users(username, password) VALUES
  ('alon01', '$2a$10$IP64aD6GTDUQvtHznWjdKOPazCiFghrh9B3TZADOnVWIF/aaXCKSG')
