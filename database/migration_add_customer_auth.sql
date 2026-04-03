USE tshirt_store;

ALTER TABLE users
  ADD COLUMN full_name VARCHAR(120) NULL AFTER username,
  ADD COLUMN email VARCHAR(120) NULL UNIQUE AFTER full_name,
  ADD COLUMN role ENUM('admin','customer') NOT NULL DEFAULT 'customer' AFTER password;

UPDATE users
SET full_name = COALESCE(full_name, 'Store Admin'),
    email = COALESCE(email, 'admin@premiumtee.local'),
    role = 'admin'
WHERE username = 'admin';
