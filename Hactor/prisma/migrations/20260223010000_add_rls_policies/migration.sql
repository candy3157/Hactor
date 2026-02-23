DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_public') THEN
    RAISE EXCEPTION 'Role "app_public" does not exist. Create it before applying this migration.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_admin') THEN
    RAISE EXCEPTION 'Role "app_admin" does not exist. Create it before applying this migration.';
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO app_public, app_admin;

GRANT SELECT ON TABLE
  "members",
  "member_activity_fields",
  "activities",
  "activity_images"
TO app_public;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  "admins",
  "admin_sessions",
  "members",
  "member_activity_fields",
  "activities",
  "activity_images"
TO app_admin;

GRANT USAGE, SELECT ON SEQUENCE "activity_images_id_seq" TO app_admin;

ALTER TABLE "admins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "member_activity_fields" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_images" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "admins" FORCE ROW LEVEL SECURITY;
ALTER TABLE "admin_sessions" FORCE ROW LEVEL SECURITY;
ALTER TABLE "members" FORCE ROW LEVEL SECURITY;
ALTER TABLE "member_activity_fields" FORCE ROW LEVEL SECURITY;
ALTER TABLE "activities" FORCE ROW LEVEL SECURITY;
ALTER TABLE "activity_images" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_admin_all" ON "admins";
DROP POLICY IF EXISTS "admin_sessions_admin_all" ON "admin_sessions";
DROP POLICY IF EXISTS "members_public_select_active" ON "members";
DROP POLICY IF EXISTS "members_admin_all" ON "members";
DROP POLICY IF EXISTS "member_activity_fields_public_select_active_members" ON "member_activity_fields";
DROP POLICY IF EXISTS "member_activity_fields_admin_all" ON "member_activity_fields";
DROP POLICY IF EXISTS "activities_public_select" ON "activities";
DROP POLICY IF EXISTS "activities_admin_all" ON "activities";
DROP POLICY IF EXISTS "activity_images_public_select" ON "activity_images";
DROP POLICY IF EXISTS "activity_images_admin_all" ON "activity_images";

CREATE POLICY "admins_admin_all"
ON "admins"
FOR ALL
TO app_admin
USING (true)
WITH CHECK (true);

CREATE POLICY "admin_sessions_admin_all"
ON "admin_sessions"
FOR ALL
TO app_admin
USING (true)
WITH CHECK (true);

CREATE POLICY "members_public_select_active"
ON "members"
FOR SELECT
TO app_public
USING ("is_active" = true);

CREATE POLICY "members_admin_all"
ON "members"
FOR ALL
TO app_admin
USING (true)
WITH CHECK (true);

CREATE POLICY "member_activity_fields_public_select_active_members"
ON "member_activity_fields"
FOR SELECT
TO app_public
USING (
  EXISTS (
    SELECT 1
    FROM "members" m
    WHERE m."id" = "member_id"
      AND m."is_active" = true
  )
);

CREATE POLICY "member_activity_fields_admin_all"
ON "member_activity_fields"
FOR ALL
TO app_admin
USING (true)
WITH CHECK (true);

CREATE POLICY "activities_public_select"
ON "activities"
FOR SELECT
TO app_public
USING (true);

CREATE POLICY "activities_admin_all"
ON "activities"
FOR ALL
TO app_admin
USING (true)
WITH CHECK (true);

CREATE POLICY "activity_images_public_select"
ON "activity_images"
FOR SELECT
TO app_public
USING (
  EXISTS (
    SELECT 1
    FROM "activities" a
    WHERE a."id" = "activity_id"
  )
);

CREATE POLICY "activity_images_admin_all"
ON "activity_images"
FOR ALL
TO app_admin
USING (true)
WITH CHECK (true);
