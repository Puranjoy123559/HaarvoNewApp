-- Each district links to its state by looking up the state's code.
-- (SELECT id FROM states WHERE code = 'AS') finds Assam's auto-generated id.

INSERT INTO districts (name, code, state_id, is_active, is_deleted, created_on, updated_on)
VALUES
  -- Assam
  ('Karbi Anglong', 'KARBI_ANGLONG', (SELECT id FROM states WHERE code = 'AS'), true, false, NOW(), NOW()),
  ('Kamrup', 'KAMRUP', (SELECT id FROM states WHERE code = 'AS'), true, false, NOW(), NOW()),
  ('Dibrugarh', 'DIBRUGARH', (SELECT id FROM states WHERE code = 'AS'), true, false, NOW(), NOW()),

  -- Meghalaya
  ('East Khasi Hills', 'EAST_KHASI_HILLS', (SELECT id FROM states WHERE code = 'ML'), true, false, NOW(), NOW()),
  ('West Garo Hills', 'WEST_GARO_HILLS', (SELECT id FROM states WHERE code = 'ML'), true, false, NOW(), NOW()),
  ('Ri-Bhoi', 'RI_BHOI', (SELECT id FROM states WHERE code = 'ML'), true, false, NOW(), NOW()),

  -- Tripura
  ('West Tripura', 'WEST_TRIPURA', (SELECT id FROM states WHERE code = 'TR'), true, false, NOW(), NOW()),
  ('Gomati', 'GOMATI', (SELECT id FROM states WHERE code = 'TR'), true, false, NOW(), NOW()),
  ('Dhalai', 'DHALAI', (SELECT id FROM states WHERE code = 'TR'), true, false, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;