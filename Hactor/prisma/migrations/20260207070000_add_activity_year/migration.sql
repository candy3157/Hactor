-- Add year column used for filesystem-style folder grouping (e.g. /Desktop/2025)
ALTER TABLE "activities" ADD COLUMN "year" INTEGER;

-- Backfill existing rows from date_label if it contains 2025/2026; otherwise use current year.
UPDATE "activities"
SET "year" = COALESCE(
  SUBSTRING("date_label" FROM '(2025|2026)')::INTEGER,
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
);

ALTER TABLE "activities" ALTER COLUMN "year" SET NOT NULL;

CREATE INDEX "activities_year_idx" ON "activities"("year");
