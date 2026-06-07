INSERT INTO promoting_agencies (name, code, is_active, is_deleted, created_on, updated_on)
VALUES
  ('None / not sure', 'NONE', true, false, NOW(), NOW()),
  ('NABARD', 'NABARD', true, false, NOW(), NOW()),
  ('ARIAS Society', 'ARIAS', true, false, NOW(), NOW()),
  ('SFAC', 'SFAC', true, false, NOW(), NOW()),
  ('Other', 'OTHER', true, false, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;