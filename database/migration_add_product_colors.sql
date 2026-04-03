USE tshirt_store;

ALTER TABLE products
  ADD COLUMN colors JSON NULL AFTER gallery;

ALTER TABLE order_items
  ADD COLUMN color VARCHAR(40) NOT NULL DEFAULT 'Default' AFTER product_id;

UPDATE products
SET colors = JSON_ARRAY('Black', 'White')
WHERE colors IS NULL;
