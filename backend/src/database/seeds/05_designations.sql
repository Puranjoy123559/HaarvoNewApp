INSERT INTO designations (name, code, is_active, is_deleted, created_on, updated_on)
VALUES
  ('CEO / Chief Executive', 'CEO', true, false, NOW(), NOW()),
  ('Chairman', 'CHAIRMAN', true, false, NOW(), NOW()),
  ('Director', 'DIRECTOR', true, false, NOW(), NOW()),
  ('Manager', 'MANAGER', true, false, NOW(), NOW()),
  ('Secretary', 'SECRETARY', true, false, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;