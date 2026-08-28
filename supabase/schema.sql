-- ─────────────────────────────────────────────────────────────
-- Snap Shield — admin dashboard schema
-- Run this once in your Supabase project:
--   Dashboard → SQL Editor → paste → Run
-- ─────────────────────────────────────────────────────────────

create table if not exists public.products (
  slug         text primary key,
  name         text not null,
  tagline      text default '',
  description  text default '',
  price        numeric(10,2) not null default 0,
  compare_at   numeric(10,2),
  rating       numeric(3,2) not null default 4.8,
  review_count integer not null default 0,
  badge        text,
  category     text not null default 'Slab Guards',
  best_seller  boolean not null default false,
  accent       text not null default '#2563EB',
  image        text default '',
  features     jsonb not null default '[]'::jsonb,
  specs        jsonb not null default '[]'::jsonb,
  colors       jsonb not null default '[]'::jsonb,
  pack_size    text not null default 'Single guard',
  sort_order   integer not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- keep updated_at fresh on every write
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ─── Row Level Security ───────────────────────────────────────
-- The public site (anon key) may READ active products only.
-- All writes go through the server using the service-role key,
-- which bypasses RLS — so no write policy is needed here.
alter table public.products enable row level security;

drop policy if exists "public reads active products" on public.products;
create policy "public reads active products"
  on public.products for select
  using ( active = true );

-- ─── Image storage bucket ─────────────────────────────────────
-- Public bucket for product photos uploaded from the dashboard.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public reads product images" on storage.objects;
create policy "public reads product images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );
