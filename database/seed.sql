USE railway;


INSERT INTO users (username, full_name, email, password, role)
VALUES
('admin', 'Store Admin', 'admin@premiumtee.local', '$2a$10$qOT.sXfo5WSz2OIpzwdrge.v0ea7prdXKKC9AS9qI2zC45UeFi/QC', 'admin')
ON DUPLICATE KEY UPDATE username = VALUES(username), full_name = VALUES(full_name), email = VALUES(email), password = VALUES(password), role = VALUES(role);

INSERT INTO products
(name, slug, price, compare_price, image, gallery, colors, sizes, stock, sale, category, badge, short_description, description, is_featured)
VALUES
(
  'Monochrome Essential Tee',
  'monochrome-essential-tee',
  29.00,
  39.00,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80'
  ),
  JSON_ARRAY('Black','White','Grey'),
  JSON_ARRAY('S','M','L','XL'),
  40,
  1,
  'Essentials',
  'Sale',
  'A clean premium staple with dense cotton and a sharp silhouette.',
  'Built for daily rotation with heavyweight combed cotton, a refined collar, and a structured drape that feels elevated without being loud.',
  1
),
(
  'Studio Graphic Tee',
  'studio-graphic-tee',
  35.00,
  0.00,
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'
  ),
  JSON_ARRAY('Black','Cream'),
  JSON_ARRAY('M','L','XL'),
  25,
  0,
  'Graphics',
  'New',
  'Minimal front hit, oversized comfort, premium washed finish.',
  'An art-directed graphic tee with soft-washed jersey, roomy shoulders, and a print treatment designed to age gracefully.',
  1
),
(
  'Athletic Performance Tee',
  'athletic-performance-tee',
  32.00,
  36.00,
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'
  ),
  JSON_ARRAY('Black','Blue','Red'),
  JSON_ARRAY('S','M','L'),
  18,
  1,
  'Sport',
  'Hot',
  'Breathable stretch fabric for active days and sharp layering.',
  'Lightweight, moisture-friendly construction paired with a close athletic cut for gym sessions, city movement, and travel.',
  0
);
