-- CORE RAMPAGE Seller System Schema for Supabase
-- Run this file in Supabase SQL Editor.

create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  phone text,
  role text default 'seller',
  created_at timestamp with time zone default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table stores add column if not exists owner_id uuid references profiles(id) on delete cascade;
alter table stores add column if not exists logo_url text;
alter table stores add column if not exists cover_url text;
alter table stores add column if not exists is_verified boolean default false;
alter table stores add column if not exists is_star boolean default false;
alter table stores add column if not exists status text default 'active';
alter table stores add column if not exists whatsapp text;
alter table stores add column if not exists category text;
alter table products add column if not exists store_id uuid references stores(id) on delete cascade;
alter table products add column if not exists status text default 'active';
alter table products add column if not exists stock integer default 999;

create table if not exists product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  name text not null,
  price integer not null default 0,
  stock integer default 999,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists verification_documents (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references profiles(id) on delete cascade,
  store_id uuid references stores(id) on delete cascade,
  ktp_url text,
  selfie_url text,
  payout_info jsonb,
  status text default 'pending',
  admin_note text,
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone
);

alter table profiles enable row level security;
alter table stores enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table verification_documents enable row level security;

create policy "Public read profiles" on profiles for select using (true);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Public read stores" on stores for select using (true);
create policy "Owner insert store" on stores for insert with check (auth.uid() = owner_id);
create policy "Owner update store" on stores for update using (auth.uid() = owner_id);
create policy "Public read active products" on products for select using (status = 'active');
create policy "Owner insert product" on products for insert with check (auth.uid() = (select owner_id from stores where stores.id = products.store_id));
create policy "Owner update product" on products for update using (auth.uid() = (select owner_id from stores where stores.id = products.store_id));
create policy "Public read active variants" on product_variants for select using (is_active = true);
create policy "Owner manage variants" on product_variants for all using (auth.uid() = (select owner_id from stores join products on products.store_id = stores.id where products.id = product_variants.product_id));
create policy "Owner insert verification" on verification_documents for insert with check (auth.uid() = seller_id);
create policy "Owner read verification" on verification_documents for select using (auth.uid() = seller_id);
