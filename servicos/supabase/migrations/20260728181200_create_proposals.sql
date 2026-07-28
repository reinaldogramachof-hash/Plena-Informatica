create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_user_id uuid references auth.users(id) on delete set null,
  title text not null,
  scope_included jsonb not null default '[]'::jsonb,
  scope_excluded jsonb not null default '[]'::jsonb,
  tech_stack jsonb,
  investment_amount numeric(12,2) not null,
  currency text not null default 'BRL',
  estimated_timeline text,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  version integer not null default 1 check (version > 0),
  valid_until date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz,
  accepted_at timestamptz
);

create index if not exists proposals_client_user_id_idx on public.proposals(client_user_id);
create index if not exists proposals_client_email_idx on public.proposals(lower(client_email));
create index if not exists proposals_status_idx on public.proposals(status);
create index if not exists proposals_created_by_idx on public.proposals(created_by);

grant select on public.proposals to authenticated;
grant insert, update, delete on public.proposals to authenticated;
grant select, insert, update, delete on public.proposals to service_role;

alter table public.proposals enable row level security;

drop policy if exists "admins can manage proposals" on public.proposals;
create policy "admins can manage proposals"
on public.proposals
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.id = (select auth.uid())
      and admin_profile.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.id = (select auth.uid())
      and admin_profile.role = 'admin'
  )
);

drop policy if exists "clients can read own proposals" on public.proposals;
create policy "clients can read own proposals"
on public.proposals
for select
to authenticated
using (client_user_id = (select auth.uid()));
