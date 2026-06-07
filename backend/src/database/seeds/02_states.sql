INSERT INTO states (name, code, is_active, is_deleted, created_on, updated_on)
VALUES
  ('Assam', 'AS', true, false, NOW(), NOW()),
  ('Meghalaya', 'ML', true, false, NOW(), NOW()),
  ('Tripura', 'TR', true, false, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;