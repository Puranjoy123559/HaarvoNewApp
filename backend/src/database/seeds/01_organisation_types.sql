INSERT INTO organisation_types (name, code, is_active, is_deleted, created_on, updated_on)
VALUES
  ('Farmer Producer Company (FPC)', 'FPC', true, false, NOW(), NOW()),
  ('Cooperative Society', 'COOPERATIVE', true, false, NOW(), NOW()),
  ('Self Help Group (SHG)', 'SHG', true, false, NOW(), NOW()),
  ('Trust / NGO', 'TRUST', true, false, NOW(), NOW()),
  ('Private Limited', 'PRIVATE_LTD', true, false, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;