DELETE FROM clients;
ALTER SEQUENCE clients_id_seq RESTART WITH 1;
-- UPDATE clients SET id=nextval('seq');
INSERT INTO clients(name, time_zone) VALUES('Grand Junction', 'US/Mountain');

DELETE FROM categories;
INSERT INTO categories(name, client_id) VALUES
  ('winter sports', 1), ('climbing', 1), ('water sports', 1), ('hiking', 1);
