-- STEP 1: Create all tables (run this first)
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title varchar(255) NOT NULL,
  description text,
  style varchar(50) NOT NULL DEFAULT 'apple',
  status varchar(50) DEFAULT 'draft',
  data jsonb DEFAULT '{"scenes": [], "timeline": [], "effects": {}}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.exports (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  format varchar(50) NOT NULL,
  status varchar(50) NOT NULL DEFAULT 'queued',
  video_url varchar(500),
  created_at timestamp with time zone DEFAULT now(),
  queue_job_id varchar(255),
  progress integer DEFAULT 0,
  error_message text
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  blob_url varchar(500) NOT NULL,
  duration_ms integer,
  type varchar(50) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.templates (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name varchar(255) NOT NULL,
  style varchar(50) NOT NULL,
  data jsonb NOT NULL,
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  downloads integer DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS exports_project_id ON public.exports(project_id);
CREATE INDEX IF NOT EXISTS exports_status ON public.exports(status);
CREATE INDEX IF NOT EXISTS media_assets_project_id ON public.media_assets(project_id);
CREATE INDEX IF NOT EXISTS templates_public ON public.templates(is_public);
CREATE INDEX IF NOT EXISTS templates_downloads ON public.templates(downloads);

-- STEP 2: Enable RLS (run after Step 1 completes)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- STEP 3: Create RLS policies (run after Step 2 completes)
-- Projects policies
CREATE POLICY "projects_select" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "projects_insert" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update" ON public.projects FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_delete" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Exports policies
CREATE POLICY "exports_select" ON public.exports FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);
CREATE POLICY "exports_insert" ON public.exports FOR INSERT WITH CHECK (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);

-- Media assets policies
CREATE POLICY "media_assets_select" ON public.media_assets FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);
CREATE POLICY "media_assets_insert" ON public.media_assets FOR INSERT WITH CHECK (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);

-- Templates policies
CREATE POLICY "templates_select" ON public.templates FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "templates_insert" ON public.templates FOR INSERT WITH CHECK (auth.uid() = user_id);
