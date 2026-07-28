-- Harden Data API grants and RLS policies for the proposals module.
-- Applied to project nnckpyzjllqsdcwlnxei on 2026-07-28 and recorded here
-- for Git traceability.

revoke all on public.profiles, public.proposals, public.consent_records, public.audit_events
  from anon, authenticated;

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.proposals to authenticated;
grant select, insert on public.consent_records to authenticated;
grant select on public.audit_events to authenticated;

update public.profiles
set role = 'admin'
where email = 'tecnologia@plenainformatica.com.br';

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using ((select auth.uid()) = id or private.is_admin((select auth.uid())));

drop policy if exists "profiles_update_admin_only" on public.profiles;
create policy "profiles_update_admin_only" on public.profiles for update
  using (private.is_admin((select auth.uid())));

drop policy if exists "proposals_select" on public.proposals;
create policy "proposals_select" on public.proposals for select
  using (client_user_id = (select auth.uid()) or private.is_admin((select auth.uid())));

drop policy if exists "proposals_admin_write" on public.proposals;
create policy "proposals_admin_insert" on public.proposals for insert
  with check (private.is_admin((select auth.uid())));

create policy "proposals_admin_update" on public.proposals for update
  using (private.is_admin((select auth.uid())))
  with check (private.is_admin((select auth.uid())));

create policy "proposals_admin_delete" on public.proposals for delete
  using (private.is_admin((select auth.uid())));

drop policy if exists "consent_insert_own" on public.consent_records;
create policy "consent_insert_own" on public.consent_records for insert
  with check (user_id = (select auth.uid()));

drop policy if exists "consent_select" on public.consent_records;
create policy "consent_select" on public.consent_records for select
  using (user_id = (select auth.uid()) or private.is_admin((select auth.uid())));

drop policy if exists "audit_select_admin_only" on public.audit_events;
create policy "audit_select_admin_only" on public.audit_events for select
  using (private.is_admin((select auth.uid())));
