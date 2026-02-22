ALTER TABLE "member_activity_fields"
ADD COLUMN IF NOT EXISTS "field_color" TEXT NOT NULL DEFAULT 'blue';

UPDATE "member_activity_fields"
SET "field_color" = 'blue'
WHERE "field_color" IS NULL
   OR BTRIM("field_color") = ''
   OR LOWER(BTRIM("field_color")) NOT IN ('red', 'blue', 'green');
