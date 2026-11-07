-- Wazir Trading Phase 2 — READ-ONLY Supabase access review
-- Run in Supabase SQL Editor before production. This script does not modify data,
-- policies, grants, or schema. Review the output before changing any permissions.

-- 1) Confirm RLS is enabled on the two public catalogue tables.
select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('cars', 'car_images', 'inquiries')
order by c.relname;

-- 2) List current RLS policies (read, insert, update, delete).
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('cars', 'car_images', 'inquiries')
order by tablename, policyname;

-- 3) Inspect table-level grants. A table-wide SELECT grant can expose every
-- column allowed by the policy, even if this website only selects a safe subset.
select
  grantee,
  table_name,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('cars', 'car_images', 'inquiries')
  and grantee in ('anon', 'authenticated', 'service_role')
order by table_name, grantee, privilege_type;

-- 4) Inspect any column-level grants already in place.
select
  grantee,
  table_name,
  column_name,
  privilege_type
from information_schema.column_privileges
where table_schema = 'public'
  and table_name in ('cars', 'car_images', 'inquiries')
  and grantee in ('anon', 'authenticated', 'service_role')
order by table_name, grantee, column_name;

-- Recommended principle (not executable here): public roles should be able to
-- SELECT only the catalogue fields required by the website, and only rows that
-- are approved for public display. Never grant anon INSERT/UPDATE/DELETE on cars
-- or car_images. Do not add public INSERT on inquiries until spam protection,
-- validation, and a least-privilege insert policy have been designed.

-- 5) Verify the columns referenced by the public inventory implementation.
select
  table_name,
  column_name,
  data_type,
  is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in ('cars', 'car_images')
  and column_name in (
    'id', 'car_id', 'ref_number', 'make', 'model', 'variant', 'year',
    'manufacture_month', 'engine_cc', 'engine_code', 'model_code',
    'fuel_type', 'transmission', 'body_type', 'color', 'drive', 'steering',
    'seats', 'doors', 'mileage_km', 'auction_grade', 'exterior_grade',
    'interior_grade', 'fob_price_usd', 'stock_location', 'port_of_loading',
    'shipment_method', 'status', 'collection', 'is_featured', 'is_new_arrival',
    'features', 'lot_number', 'created_at', 'updated_at', 'image_url',
    'is_primary', 'display_order'
  )
order by table_name, ordinal_position;

-- 6) ref_number must be unique for stable /cars/[ref] detail URLs.
select ref_number, count(*) as row_count
from public.cars
where ref_number is not null
 group by ref_number
having count(*) > 1
order by row_count desc, ref_number;

-- 7) Inventory counts help compare the application catalogue with the database.
select status, count(*) as vehicle_count
from public.cars
group by status
order by vehicle_count desc, status;
