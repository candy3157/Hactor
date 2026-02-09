-- Add source date used for chronological sorting and folder grouping.
ALTER TABLE "activities"
ADD COLUMN "date" DATE;

-- Backfill from existing year/date_label values when possible, otherwise fallback to created_at.
UPDATE "activities"
SET "date" = COALESCE(
  CASE
    WHEN TRIM("date_label") ~* '^[A-Za-z]{3}\s+[0-9]{1,2}$'
      THEN TO_DATE(("year"::TEXT || ' ' || TRIM("date_label")), 'YYYY Mon DD')
    ELSE NULL
  END,
  "created_at"::DATE
);

ALTER TABLE "activities"
ALTER COLUMN "date" SET NOT NULL;

CREATE INDEX "activities_date_idx" ON "activities"("date");
