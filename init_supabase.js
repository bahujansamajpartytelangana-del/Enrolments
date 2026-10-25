const https = require('https');

const token = process.env.SUPABASE_ACCESS_TOKEN || '';
const projectRef = process.env.SUPABASE_PROJECT_REF || 'apibdsfzrdfszamphvfn';

const sql = `
-- 1. Create enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    district TEXT NOT NULL,
    constituency TEXT NOT NULL,
    mandal TEXT,
    village TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'enrolled')),
    is_bulk BOOLEAN NOT NULL DEFAULT FALSE,
    operator TEXT DEFAULT 'Unassigned',
    notes TEXT,
    enrolled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing for fast dashboard counts & queries
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON public.enrollments(created_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_district ON public.enrollments(district);
CREATE INDEX IF NOT EXISTS idx_enrollments_constituency ON public.enrollments(constituency);

-- Enable Row Level Security (RLS)
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read, insert, update for the app
DROP POLICY IF EXISTS "Allow anon read enrollments" ON public.enrollments;
CREATE POLICY "Allow anon read enrollments" ON public.enrollments
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow anon insert enrollments" ON public.enrollments;
CREATE POLICY "Allow anon insert enrollments" ON public.enrollments
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update enrollments" ON public.enrollments;
CREATE POLICY "Allow anon update enrollments" ON public.enrollments
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Enable Realtime replication for enrollments table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'enrollments'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.enrollments;
    END IF;
END $$;

-- 2. Create district_profiles table
CREATE TABLE IF NOT EXISTS public.district_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    incharge_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'District Incharge',
    phone TEXT NOT NULL,
    photo TEXT,
    strength TEXT NOT NULL DEFAULT 'Moderate' CHECK (strength IN ('Strong', 'Moderate', 'Weak')),
    score INTEGER NOT NULL DEFAULT 70,
    action_plan TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.district_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all district_profiles" ON public.district_profiles;
CREATE POLICY "Allow anon all district_profiles" ON public.district_profiles
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 3. Seed initial enrollments if table is empty
INSERT INTO public.enrollments (full_name, phone, district, constituency, mandal, village, status, is_bulk, operator, created_at)
SELECT * FROM (VALUES
    ('Anil Kumar Reddy', '+91 98481 23451', 'Rangareddy', 'Serilingampally', 'Miyapur', 'Hafeezpet', 'enrolled', false, 'Operator #04 (Kiran)', now() - interval '25 minutes'),
    ('Swathi Priya Rao', '+91 99890 11223', 'Hyderabad', 'Jubilee Hills', 'Khairatabad', 'Banjara Hills', 'pending', true, 'Pending Queue', now() - interval '42 minutes'),
    ('Mahesh Babu Goud', '+91 97012 44556', 'Rangareddy', 'Chevella', 'Shabad', 'Chandanavelli', 'pending', true, 'Pending Queue', now() - interval '1 hour'),
    ('Lakshmi Narayana', '+91 94401 88990', 'Medchal-Malkajgiri', 'Uppal', 'Malkajgiri', 'Moula Ali', 'enrolled', false, 'Operator #02 (Divya)', now() - interval '2 hours'),
    ('Ramesh Varma', '+91 98480 33441', 'Karimnagar', 'Huzurabad', 'Jammikunta', 'Vavilala', 'pending', false, 'Pending Queue', now() - interval '3 hours'),
    ('Sunitha Kumari', '+91 98485 77889', 'Khammam', 'Palair', 'Khammam Urban', 'Wyra Road', 'enrolled', true, 'Operator #01 (Suresh)', now() - interval '4 hours'),
    ('M. Venugopal Rao', '+91 97018 99001', 'Hanumakonda', 'Warangal West', 'Hanamkonda', 'Subedari', 'pending', false, 'Pending Queue', now() - interval '5 hours')
) AS v(full_name, phone, district, constituency, mandal, village, status, is_bulk, operator, created_at)
WHERE NOT EXISTS (SELECT 1 FROM public.enrollments LIMIT 1);
`;

const postData = JSON.stringify({ query: sql });

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: `/v1/projects/${projectRef}/database/query`,
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Error executing query:', e);
});

req.write(postData);
req.end();
