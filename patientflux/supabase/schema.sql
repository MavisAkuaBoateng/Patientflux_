-- Patients table
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  patient_id text unique not null,
  name text not null,
  age int not null,
  gender text not null,
  department text not null,
  visit_type text not null,
  symptoms text not null,
  high_risk boolean not null default false,
  priority_tag text not null default 'Normal',
  status text not null default 'waiting', -- waiting | in-consultation | completed
  created_at timestamptz not null default now()
);

-- Ledger logs table (MVP stub)
create table if not exists public.ledger_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  action text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- Users table (placeholder for roles)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  role text check (role in ('doctor','admin','receptionist')),
  created_at timestamptz not null default now()
);

-- Realtime
alter publication supabase_realtime add table public.patients;

-- RLS (disabled for MVP simplicity)
alter table public.patients disable row level security;
alter table public.ledger_logs disable row level security;
alter table public.users disable row level security;