INSERT INTO crops (name, code, is_active, is_deleted, created_on, updated_on)
VALUES
  ('Ginger', 'GINGER', true, false, NOW(), NOW()),
  ('Turmeric', 'TURMERIC', true, false, NOW(), NOW()),
  ('Black Pepper', 'BLACK_PEPPER', true, false, NOW(), NOW()),
  ('Tea', 'TEA', true, false, NOW(), NOW()),
  ('Rice', 'RICE', true, false, NOW(), NOW()),
  ('Other', 'OTHER', true, false, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;