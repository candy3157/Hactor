ALTER TABLE "member_activity_fields"
DROP CONSTRAINT IF EXISTS "member_activity_fields_field_id_fkey";

ALTER TABLE "member_activity_fields"
DROP CONSTRAINT IF EXISTS "member_activity_fields_pkey";

DROP INDEX IF EXISTS "member_activity_fields_field_id_idx";

ALTER TABLE "member_activity_fields"
ADD COLUMN IF NOT EXISTS "field_id_text" TEXT;

UPDATE "member_activity_fields" AS maf
SET "field_id_text" = COALESCE(
  NULLIF(BTRIM(af."label"), ''),
  NULLIF(BTRIM(af."code"), ''),
  maf."field_id"::text
)
FROM "activity_fields" AS af
WHERE af."id" = maf."field_id"
  AND (maf."field_id_text" IS NULL OR BTRIM(maf."field_id_text") = '');

UPDATE "member_activity_fields" AS maf
SET "field_id_text" = NULLIF(BTRIM(maf."field_id"::text), '')
WHERE maf."field_id_text" IS NULL OR BTRIM(maf."field_id_text") = '';

ALTER TABLE "member_activity_fields"
DROP COLUMN IF EXISTS "field_id";

ALTER TABLE "member_activity_fields"
RENAME COLUMN "field_id_text" TO "field_id";

ALTER TABLE "member_activity_fields"
ALTER COLUMN "field_id" TYPE TEXT;

ALTER TABLE "member_activity_fields"
ALTER COLUMN "field_id" SET NOT NULL;

INSERT INTO "member_activity_fields" ("member_id", "field_id", "assigned_at")
SELECT
  m."id",
  BTRIM(token),
  NOW()
FROM "members" AS m
CROSS JOIN LATERAL regexp_split_to_table(
  COALESCE(m."activity_fields_text", ''),
  E'[\\n,]+'
) AS token
WHERE BTRIM(token) <> '';

DELETE FROM "member_activity_fields"
WHERE BTRIM("field_id") = '';

WITH ranked AS (
  SELECT
    ctid,
    ROW_NUMBER() OVER (
      PARTITION BY "member_id", "field_id"
      ORDER BY "assigned_at" ASC, ctid
    ) AS rn
  FROM "member_activity_fields"
)
DELETE FROM "member_activity_fields" AS maf
USING ranked
WHERE maf.ctid = ranked.ctid
  AND ranked.rn > 1;

ALTER TABLE "member_activity_fields"
ADD CONSTRAINT "member_activity_fields_pkey"
PRIMARY KEY ("member_id", "field_id");

CREATE INDEX IF NOT EXISTS "member_activity_fields_field_id_idx"
ON "member_activity_fields" ("field_id");

ALTER TABLE "members"
DROP COLUMN IF EXISTS "activity_fields_text";

DROP TABLE IF EXISTS "activity_fields";
