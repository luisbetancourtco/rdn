-- =============================================================
-- Enable RLS and create policies for ALL tables
-- =============================================================
-- NOTE: Prisma connects via service_role key which bypasses RLS.
-- These policies apply to Supabase client SDK (anon/authenticated).
-- =============================================================

-- Helper: resolve current user's integer ID from Supabase Auth JWT
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS INT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM "User" WHERE email = auth.jwt() ->> 'email' LIMIT 1;
$$;

-- Helper: check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM "User"
    WHERE email = auth.jwt() ->> 'email'
      AND role = 'admin'
  );
$$;

-- =============================================================
-- User
-- =============================================================
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON "User" FOR SELECT
  USING (id = public.current_user_id() OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON "User" FOR UPDATE
  USING (id = public.current_user_id())
  WITH CHECK (id = public.current_user_id());

CREATE POLICY "Admins can insert users"
  ON "User" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update any user"
  ON "User" FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete users"
  ON "User" FOR DELETE
  USING (public.is_admin());

-- =============================================================
-- NewsItem (admin-only)
-- =============================================================
ALTER TABLE "NewsItem" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read news"
  ON "NewsItem" FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert news"
  ON "NewsItem" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update news"
  ON "NewsItem" FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete news"
  ON "NewsItem" FOR DELETE
  USING (public.is_admin());

-- =============================================================
-- Setting (admin-only)
-- =============================================================
ALTER TABLE "Setting" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read settings"
  ON "Setting" FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert settings"
  ON "Setting" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update settings"
  ON "Setting" FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete settings"
  ON "Setting" FOR DELETE
  USING (public.is_admin());

-- =============================================================
-- Course: authenticated read, admin write
-- =============================================================
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read courses"
  ON "Course" FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert courses"
  ON "Course" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update courses"
  ON "Course" FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete courses"
  ON "Course" FOR DELETE
  USING (public.is_admin());

-- =============================================================
-- CourseModule: authenticated read, admin write
-- =============================================================
ALTER TABLE "CourseModule" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read modules"
  ON "CourseModule" FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert modules"
  ON "CourseModule" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update modules"
  ON "CourseModule" FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete modules"
  ON "CourseModule" FOR DELETE
  USING (public.is_admin());

-- =============================================================
-- Topic: authenticated read, admin write
-- =============================================================
ALTER TABLE "Topic" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read topics"
  ON "Topic" FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert topics"
  ON "Topic" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update topics"
  ON "Topic" FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete topics"
  ON "Topic" FOR DELETE
  USING (public.is_admin());

-- =============================================================
-- Material: authenticated read, admin write
-- =============================================================
ALTER TABLE "Material" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read materials"
  ON "Material" FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert materials"
  ON "Material" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update materials"
  ON "Material" FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete materials"
  ON "Material" FOR DELETE
  USING (public.is_admin());

-- =============================================================
-- CourseAccess: user reads own, admin full CRUD
-- =============================================================
ALTER TABLE "CourseAccess" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own course access"
  ON "CourseAccess" FOR SELECT
  USING ("userId" = public.current_user_id() OR public.is_admin());

CREATE POLICY "Admins can insert course access"
  ON "CourseAccess" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete course access"
  ON "CourseAccess" FOR DELETE
  USING (public.is_admin());

-- =============================================================
-- TopicProgress: user owns their progress, admin can read all
-- =============================================================
ALTER TABLE "TopicProgress" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON "TopicProgress" FOR SELECT
  USING ("userId" = public.current_user_id() OR public.is_admin());

CREATE POLICY "Users can insert own progress"
  ON "TopicProgress" FOR INSERT
  WITH CHECK ("userId" = public.current_user_id());

CREATE POLICY "Users can update own progress"
  ON "TopicProgress" FOR UPDATE
  USING ("userId" = public.current_user_id())
  WITH CHECK ("userId" = public.current_user_id());

CREATE POLICY "Users can delete own progress"
  ON "TopicProgress" FOR DELETE
  USING ("userId" = public.current_user_id());

-- =============================================================
-- UserGroup: authenticated read, admin write
-- =============================================================
ALTER TABLE "UserGroup" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read groups"
  ON "UserGroup" FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert groups"
  ON "UserGroup" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update groups"
  ON "UserGroup" FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete groups"
  ON "UserGroup" FOR DELETE
  USING (public.is_admin());

-- =============================================================
-- UserGroupMember: user reads own membership, admin full CRUD
-- =============================================================
ALTER TABLE "UserGroupMember" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own group membership"
  ON "UserGroupMember" FOR SELECT
  USING ("userId" = public.current_user_id() OR public.is_admin());

CREATE POLICY "Admins can insert group members"
  ON "UserGroupMember" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete group members"
  ON "UserGroupMember" FOR DELETE
  USING (public.is_admin());

-- =============================================================
-- Asesoria: user reads own, admin full CRUD
-- =============================================================
ALTER TABLE "Asesoria" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own asesorias"
  ON "Asesoria" FOR SELECT
  USING ("userId" = public.current_user_id() OR public.is_admin());

CREATE POLICY "Admins can insert asesorias"
  ON "Asesoria" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update asesorias"
  ON "Asesoria" FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete asesorias"
  ON "Asesoria" FOR DELETE
  USING (public.is_admin());

-- =============================================================
-- AsesoriaTask: user reads own (via asesoria), admin full CRUD
-- =============================================================
ALTER TABLE "AsesoriaTask" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own asesoria tasks"
  ON "AsesoriaTask" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Asesoria"
      WHERE "Asesoria".id = "AsesoriaTask"."asesoriaId"
        AND ("Asesoria"."userId" = public.current_user_id() OR public.is_admin())
    )
  );

CREATE POLICY "Users can update own asesoria tasks"
  ON "AsesoriaTask" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "Asesoria"
      WHERE "Asesoria".id = "AsesoriaTask"."asesoriaId"
        AND "Asesoria"."userId" = public.current_user_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Asesoria"
      WHERE "Asesoria".id = "AsesoriaTask"."asesoriaId"
        AND "Asesoria"."userId" = public.current_user_id()
    )
  );

CREATE POLICY "Admins can insert asesoria tasks"
  ON "AsesoriaTask" FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update asesoria tasks"
  ON "AsesoriaTask" FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete asesoria tasks"
  ON "AsesoriaTask" FOR DELETE
  USING (public.is_admin());
