-- Pacote F9 — Gestao Escritorio e login unificado
-- Schema aplicado no projeto Supabase nnckpyzjllqsdcwlnxei em 2026-07-28.

-- Papel de acesso: staff = admin ou recepcao (quem opera o Escritorio)
create or replace function private.is_staff(uid uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles p
    where p.id = uid and p.role in ('admin', 'recepcao')
  );
end;
$$;

-- Areas visiveis no login (cards): controla so a navegacao, nao substitui RLS
alter table public.profiles add column if not exists areas text[] not null default '{}';

-- Cadastro central de clientes (compartilhado entre Escritorio e Digital)
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  document text,
  address text,
  notes text,
  origin text not null default 'escritorio' check (origin in ('escritorio', 'digital')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_clients_email on public.clients (lower(email));
create index idx_clients_document on public.clients (document);

create table public.client_tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  text text not null,
  completed boolean not null default false,
  due_date date,
  created_at timestamptz not null default now()
);
create index idx_client_tasks_client_id on public.client_tasks (client_id);

create table public.office_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text,
  active boolean not null default true
);

create table public.office_transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  amount numeric(12,2) not null,
  quantity integer,
  description text not null,
  category_id uuid references public.office_categories(id),
  client_id uuid references public.clients(id),
  tags text[] not null default '{}',
  transaction_date date not null,
  payment_method text not null check (payment_method in ('cash', 'card', 'transfer', 'pix', 'other')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create index idx_office_transactions_date on public.office_transactions (transaction_date);
create index idx_office_transactions_category on public.office_transactions (category_id);

create table public.office_service_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  default_price numeric(12,2) not null,
  active boolean not null default true
);

create table public.office_service_records (
  id uuid primary key default gen_random_uuid(),
  service_item_id uuid references public.office_service_items(id),
  name text not null,
  quantity integer not null default 1,
  client_id uuid references public.clients(id),
  record_date date not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create index idx_office_service_records_date on public.office_service_records (record_date);

create table public.office_cash_closings (
  id uuid primary key default gen_random_uuid(),
  closing_date date not null unique,
  total_income numeric(12,2) not null,
  total_expense numeric(12,2) not null,
  balance numeric(12,2) not null,
  notes text,
  closed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- RLS: so staff (admin/recepcao) acessa dados de Escritorio; clientes finais nao tem acesso nenhum
alter table public.clients enable row level security;
create policy "clients_staff_all" on public.clients for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.client_tasks enable row level security;
create policy "client_tasks_staff_all" on public.client_tasks for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.office_categories enable row level security;
create policy "office_categories_staff_all" on public.office_categories for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.office_transactions enable row level security;
create policy "office_transactions_staff_all" on public.office_transactions for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.office_service_items enable row level security;
create policy "office_service_items_staff_all" on public.office_service_items for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.office_service_records enable row level security;
create policy "office_service_records_staff_all" on public.office_service_records for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

alter table public.office_cash_closings enable row level security;
create policy "office_cash_closings_staff_all" on public.office_cash_closings for all
  using (private.is_staff((select auth.uid()))) with check (private.is_staff((select auth.uid())));

-- Grants finais: authenticated somente; RLS faz a separacao entre staff e demais usuarios.
revoke all on
  public.clients, public.client_tasks, public.office_categories,
  public.office_transactions, public.office_service_items,
  public.office_service_records, public.office_cash_closings
  from anon, authenticated;

grant usage on schema public to authenticated;
grant select, insert, update, delete on
  public.clients, public.client_tasks, public.office_categories,
  public.office_transactions, public.office_service_items,
  public.office_service_records, public.office_cash_closings
  to authenticated;

-- Exemplos para decisao operacional posterior:
-- update public.profiles set areas = array['escritorio'] where email = 'email-da-colaboradora@...';
-- update public.profiles set areas = array['escritorio','digital'] where role = 'admin';
