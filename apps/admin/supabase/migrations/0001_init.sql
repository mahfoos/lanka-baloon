-- Sri Lanka Balloon — initial schema
-- Run in Supabase SQL editor, or `supabase db push`.
--
-- Two apps share this database:
--   lanka-baloon-landing  connects as `anon`; the policies below let it INSERT
--                         reservations and messages, and read nothing back.
--   lanka-baloon-admin    connects with the service-role key, which bypasses RLS
--                         entirely — staff access is gated by the ERP's own role
--                         permissions (lib/roles.ts), not by these policies.
--
-- The `admins` table and the admin policies are therefore not used by either app
-- today. They are kept so Supabase Auth remains a usable second route into the
-- data (SQL editor, a future mobile client) without reopening the whole table.

create type flight_type as enum ('standard', 'private');
create type booking_status as enum ('new', 'confirmed', 'paid', 'flown', 'cancelled_weather', 'cancelled_guest');

create table public.bookings (
  id            uuid primary key default gen_random_uuid(),
  reference     text unique not null default ('SLB-' || upper(substr(md5(random()::text), 1, 6))),
  created_at    timestamptz not null default now(),
  full_name     text not null,
  email         text not null,
  phone         text not null,
  country       text not null,
  flight_date   date not null,
  hotel         text not null,
  flight_type   flight_type not null default 'standard',
  adults        int not null check (adults between 1 and 16),
  children      int not null default 0 check (children between 0 and 5),
  gift_voucher  boolean not null default false,
  birthday_cake boolean not null default false,
  requests      text,
  total_usd     int not null,            -- calculated on the server, never trusted from the browser
  status        booking_status not null default 'new',
  admin_notes   text
);

create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text not null,
  message    text not null,
  handled    boolean not null default false
);

-- Staff who can see bookings. Add a row after creating the user in Supabase Auth:
--   insert into public.admins (user_id) values ('<auth user uuid>');
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter table public.bookings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admins enable row level security;

-- Public visitors can only INSERT (no reading other people's bookings).
create policy "anyone can create a booking" on public.bookings
  for insert to anon, authenticated with check (status = 'new' and admin_notes is null);
create policy "admins read bookings" on public.bookings
  for select to authenticated using (public.is_admin());
create policy "admins update bookings" on public.bookings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "anyone can send a message" on public.contact_messages
  for insert to anon, authenticated with check (handled = false);
create policy "admins read messages" on public.contact_messages
  for select to authenticated using (public.is_admin());
create policy "admins update messages" on public.contact_messages
  for update to authenticated using (public.is_admin());

create policy "admins see admins" on public.admins
  for select to authenticated using (user_id = auth.uid());

create index bookings_flight_date_idx on public.bookings (flight_date);
create index bookings_status_idx on public.bookings (status);
