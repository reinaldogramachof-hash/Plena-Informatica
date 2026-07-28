create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null,
  document_id uuid not null,
  document_version integer not null,
  user_agent text,
  ip_address inet,
  accepted_at timestamptz not null default now()
);

create index if not exists consent_records_user_id_idx on public.consent_records(user_id);
create index if not exists consent_records_document_idx on public.consent_records(document_type, document_id);

grant insert, select on public.consent_records to authenticated;
grant select, insert, update, delete on public.consent_records to service_role;

alter table public.consent_records enable row level security;

drop policy if exists "admins can read all consent records" on public.consent_records;
create policy "admins can read all consent records"
on public.consent_records
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

drop policy if exists "clients can read own consent records" on public.consent_records;
create policy "clients can read own consent records"
on public.consent_records
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "clients can accept own proposals" on public.consent_records;
create policy "clients can accept own proposals"
on public.consent_records
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and document_type = 'proposal'
  and exists (
    select 1
    from public.proposals proposal
    where proposal.id = document_id
      and proposal.version = document_version
      and proposal.client_user_id = (select auth.uid())
      and proposal.status = 'sent'
  )
);

create or replace function private.handle_proposal_acceptance()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
begin
  if new.document_type = 'proposal' then
    update public.proposals
       set status = 'accepted',
           accepted_at = new.accepted_at,
           updated_at = now()
     where id = new.document_id
       and version = new.document_version
       and client_user_id = new.user_id
       and status = 'sent';

    insert into public.audit_events (
      actor_user_id,
      action,
      resource_type,
      resource_id,
      metadata
    )
    values (
      new.user_id,
      'proposal.accepted',
      'proposal',
      new.document_id::text,
      jsonb_build_object(
        'document_version', new.document_version,
        'consent_record_id', new.id
      )
    );
  end if;

  return new;
end;
$$;

revoke all on function private.handle_proposal_acceptance() from public;
grant execute on function private.handle_proposal_acceptance() to service_role;

drop trigger if exists on_consent_record_proposal_acceptance on public.consent_records;
create trigger on_consent_record_proposal_acceptance
after insert on public.consent_records
for each row
execute function private.handle_proposal_acceptance();
