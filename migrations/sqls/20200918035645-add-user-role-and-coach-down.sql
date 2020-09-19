/* Replace with your SQL commands */
ALTER TABLE users
  DROP COLUMN IF EXISTS coach_id;

ALTER TABLE users
  DROP COLUMN IF EXISTS user_role;