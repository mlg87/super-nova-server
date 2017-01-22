-- we delete tables in reverse order because of fk constraints


DELETE FROM customers;
DELETE FROM customer_types;
DELETE FROM users;
DELETE FROM join_brands_item_types;
DELETE FROM join_tags_inventory;
DELETE FROM inventory;
DELETE FROM genders;
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
  ('Miura', 1), ('Corax', 4), ('Fairpoint 40', 3), ('C14', 5);

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

ALTER SEQUENCE genders_id_seq RESTART WITH 1;
INSERT INTO genders(customer, inventory) VALUES
  ('Male', 'Men''s'), ('Female', 'Women''s'), (null, 'Kids'), ('Other', null);

ALTER SEQUENCE inventory_id_seq RESTART WITH 1;
INSERT INTO inventory(item_type_id, size_id, gender_id, model_id, image_url) VALUES
  (1, NULL, NULL, 4, 'http://eddyline.com/wp-content/uploads/c14-yellow.jpg'),
  (2, 5, 1, 1, 'http://www.sportiva.com/media/catalog/product/cache/1/image/1200x1200/9df78eab33525d08d6e5fb8d27136e95/9/7/971_yel_miura_1_7.jpg'),
  (3, 2, 1, 2, 'https://www.rei.com/media/product/871097'),
  (4, 7, 2, 3, 'https://www.rei.com/media/product/894562');

INSERT INTO join_tags_inventory(tag_id, inventory_id) VALUES
  (5, 1), (3, 2), (4, 3), (1, 4), (2, 4);

INSERT INTO join_brands_item_types(brand_id, item_type_id) VALUES
  (1, 1), (2, 1), (3, 4), (4, 2), (4, 4), (5, 1);

ALTER SEQUENCE users_id_seq RESTART WITH 1;
INSERT INTO users(username, password) VALUES
  ('alon01', '$2a$10$IP64aD6GTDUQvtHznWjdKOPazCiFghrh9B3TZADOnVWIF/aaXCKSG'),
  ('topleft', '$2a$10$YWXVLeTzjl5httlnFcSeYu9V85FCEnJlYlVX1.pdEBYH2riDLXGsS');

ALTER SEQUENCE customer_types_id_seq RESTART WITH 1;
INSERT INTO customer_types(type) VALUES
  ('Staff'), ('Student'), ('Alumni'), ('Public');

INSERT INTO customers(first_name, last_name, user_id, type_id, gender_id, email, student_id, phone_number, address, birth_date) VALUES
  (
    'Alon',
    'Dahari',
    1,
    1,
    1,
    'climbinghobo@gmail.com',
    null,
    '5415151548',
    row('4127 Tejon street', 'Denver', 'CO', 'USA', '80211'),
    '1984-02-28'
  ),
  (
    'Dick',
    'Grossweiner',
    null,
    2,
    4,
    'dick69@gmail.com',
    'M-12345',
    '9384628463',
    row('9612 sunset st', 'pembroke pines', 'LA', 'USA', '18332'),
    '1982-11-13'
  ),
  (
    'vicki',
    'mitchell',
    null,
    2,
    2,
    'vicki.mitchell@example.com',
    'M-74533',
    '5879055543',
    row('5649 central st', 'clearwater', 'OR', 'USA', '78937'),
    '1985-10-11'
  ),
  (
    'todd',
    'perez',
    null,
    3,
    2,
    'todd.perez@example.com',
    null,
    '7460923497',
    row('6660 college st', 'fountain valley', 'AR', 'USA', '85701'),
    '1952-04-07'
  );
