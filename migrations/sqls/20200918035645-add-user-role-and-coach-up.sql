/* Replace with your SQL commands */

ALTER TABLE users
  ADD COLUMN "coach_id" BIGINT,
  ADD FOREIGN KEY ("coach_id") REFERENCES users("id");

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS "role" user_role;

ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'CLIENT';

ALTER TABLE "public"."users" ALTER COLUMN "role" SET NOT NULL;