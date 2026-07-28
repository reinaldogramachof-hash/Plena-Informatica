create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_events_actor_user_id_idx on public.audit_events(actor_user_id);
create index if not exists audit_events_resource_idx on public.audit_events(resource_type, resource_id);
create index if not exists audit_events_created_at_idx on public.audit_events(created_at desc);

grant insert on public.audit_events to authenticated;
grant select, insert, update, delete on public.audit_events to service_role;

alter table public.audit_events enable row level security;

drop policy if exists "admins can read audit events" on public.audit_events;
create policy "admins can read audit events"
on public.audit_events
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.id = (select auth.uid())
      and admin_profile.role = 'admin'
  )
);

drop policy if exists "authenticated users can insert audit events" on public.audit_events;
create policy "authenticated users can insert audit events"
on public.audit_events
for insert
to authenticated
with check (actor_user_id = (select auth.uid()));
