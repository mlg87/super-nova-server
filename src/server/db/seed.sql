DELETE FROM clients;
-- reset the id field so it can be referenced by other tables
ALTER SEQUENCE clients_id_seq RESTART WITH 1;
INSERT INTO clients(name, time_zone) VALUES('Grand Junction', 'US/Mountain');

DELETE FROM categories;
-- reset the id field so it can be referenced by other tables
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
INSERT INTO categories(name, client_id) VALUES
  ('winter sports', 1), ('climbing', 1), ('water sports', 1), ('hiking', 1);

DELETE FROM item_types;
ALTER SEQUENCE item_types_id_seq RESTART WITH 1;
INSERT INTO item_types(name, category_id, client_id) VALUES
  ('kayak', 3, 1), ('climbing shoes', 2, 1), ('harness', 2, 1), ('backpack', 4, 1);

DELETE FROM inventory;
INSERT INTO inventory(item_type_id, size, model, client_id) VALUES
  (1, NULL, NULL, 1), (2, '41', 'La Sportiva Miura', 1), (3, 'medium', 'Arctery`x', 1);

DELETE FROM users;
INSERT INTO users(username, password) VALUES
  ('alon01', '$2a$10$IP64aD6GTDUQvtHznWjdKOPazCiFghrh9B3TZADOnVWIF/aaXCKSG')
