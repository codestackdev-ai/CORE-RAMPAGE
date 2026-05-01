-- CORE RAMPAGE RLS FIX FOR SELLER REGISTRATION
-- Run this in Supabase SQL Editor when seller registration returns:
-- new row violates row-level security policy for table "stores"

-- Make sure columns exist
alter table public.stores add column if not exists owner_id uuid references public.profiles(id) on delete cascade;
alter table public.stores add column if not exists badge_type text default 'unverified';
alter table public.stores add column if not exists status text default 'active';
alter table public.stores add column if not exists whatsapp text;
alter table public.stores add column if not exists logo_url text;
alter table public.stores add column if not exists cover_url text;
alter table public.stores add column if not exists category text;

-- Ensure RLS is enabled but policies are correct
alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;

-- Clean duplicate/old policies safely
drop policy if exists "Public read profiles" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Users insert own profile" on public.profiles;
drop policy if exists "Public read stores" on public.stores;
drop policy if exists "Owner insert store" on public.stores;
drop policy if exists "Owner update store" on public.stores;
drop policy if exists "Owner delete store" on public.stores;
drop policy if exists "Public read active products" on public.products;
drop policy if exists "Owner insert product" on public.products;
drop policy if exists "Owner update product" on public.products;
drop policy if exists "Owner delete product" on public.products;

-- Profiles policies
create policy "Public read profiles"
on public.profiles for select
using (true);

create policy "Users insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Store policies
create policy "Public read stores"
on public.stores for select
using (true);

create policy "Owner insert store"
on public.stores for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Owner update store"
on public.stores for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Owner delete store"
on public.stores for delete
to authenticated
using (auth.uid() = owner_id);

-- Product policies
create policy "Public read active products"
on public.products for select
using (coalesce(status, 'active') = 'active');

create policy "Owner insert product"
on public.products for insert
to authenticated
with check (
  exists (
    select 1 from public.stores
    where public.stores.id = products.store_id
    and public.stores.owner_id = auth.uid()
  )
);

create policy "Owner update product"
on public.products for update
to authenticated
using (
  exists (
    select 1 from public.stores
    where public.stores.id = products.store_id
    and public.stores.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.stores
    where public.stores.id = products.store_id
    and public.stores.owner_id = auth.uid()
  )
);

create policy "Owner delete product"
on public.products for delete
to authenticated
using (
  exists (
    select 1 from public.stores
    where public.stores.id = products.store_id
    and public.stores.owner_id = auth.uid()
  )
);
