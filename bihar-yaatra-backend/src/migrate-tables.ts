/**
 * Migration script using the Supabase Management API SQL endpoint.
 * Run: npx ts-node src/migrate-tables.ts
 */
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function runSQL(sql: string, label: string) {
  // Use the pg_dump/query endpoint via PostgREST isn't available,
  // so we use the Supabase Management API
  const refMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  const projectRef = refMatch ? refMatch[1] : '';
  
  // The Supabase SQL endpoint: POST /pg/query
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`✗ ${label}: ${text}`);
    return false;
  }
  console.log(`✓ ${label}`);
  return true;
}

async function migrate() {
  console.log("Running migrations via Supabase...\n");
  
  // Since we can't run raw SQL via the REST API without an exec_sql function,
  // we'll use the alternative approach: create an exec_sql function first via
  // the Supabase dashboard, or just output the SQL for the user.
  
  console.log("=== SQL TO RUN IN SUPABASE DASHBOARD (SQL Editor) ===\n");
  
  const sql = `
-- 1. Create transports table
CREATE TABLE IF NOT EXISTS public.transports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  route_from TEXT NOT NULL,
  route_to TEXT NOT NULL,
  departure_time TEXT,
  arrival_time TEXT,
  price_per_day NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  is_available BOOLEAN DEFAULT true,
  provider_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add description column to homestays (if missing)
ALTER TABLE public.homestays ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Enable RLS on transports
ALTER TABLE public.transports ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policy for authenticated access
CREATE POLICY "Allow all for service role" ON public.transports
  FOR ALL USING (true) WITH CHECK (true);

-- 5. Grant access to the anon and authenticated roles
GRANT SELECT ON public.transports TO anon, authenticated;
GRANT ALL ON public.transports TO service_role;
`;

  console.log(sql);
  console.log("\n=== END SQL ===");
  console.log("\nPlease run the above SQL in your Supabase Dashboard > SQL Editor.");
  console.log("Then run: npx ts-node src/seed-services.ts");
}

migrate();
