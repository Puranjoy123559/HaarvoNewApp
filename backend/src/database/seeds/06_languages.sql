INSERT INTO languages (name, code, is_active, is_deleted, created_on, updated_on)
VALUES
  ('English', 'EN', true, false, NOW(), NOW()),
  ('Hindi', 'HI', true, false, NOW(), NOW()),
  ('Assamese', 'AS', true, false, NOW(), NOW()),
  ('Bengali', 'BN', true, false, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;