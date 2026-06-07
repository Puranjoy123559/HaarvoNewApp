-- max_value is NULL for the "500+" range, meaning "and above".
INSERT INTO member_ranges (label, code, min_value, max_value, is_active, is_deleted, created_on, updated_on)
VALUES
  ('Less than 50 members', '0_50', 0, 50, true, false, NOW(), NOW()),
  ('50 - 150 members', '50_150', 50, 150, true, false, NOW(), NOW()),
  ('150 - 500 members', '150_500', 150, 500, true, false, NOW(), NOW()),
  ('500+ members', '500_PLUS', 500, NULL, true, false, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;