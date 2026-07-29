-- Ajustes posteriores ao Pacote F9.
-- Aplicado no projeto Supabase nnckpyzjllqsdcwlnxei em 2026-07-28.

alter table public.proposals
  add column if not exists client_id uuid references public.clients(id);

update public.proposals p
set client_id = c.id
from public.clients c
where p.client_id is null
  and lower(c.email) = lower(p.client_email);

-- Indices para chaves estrangeiras apontadas pelos performance advisors.
create index if not exists idx_audit_events_actor_user_id
  on public.audit_events (actor_user_id);

create index if not exists idx_clients_created_by
  on public.clients (created_by);

create index if not exists idx_office_cash_closings_closed_by
  on public.office_cash_closings (closed_by);

create index if not exists idx_office_service_records_client_id
  on public.office_service_records (client_id);

create index if not exists idx_office_service_records_created_by
  on public.office_service_records (created_by);

create index if not exists idx_office_service_records_service_item_id
  on public.office_service_records (service_item_id);

create index if not exists idx_office_transactions_client_id
  on public.office_transactions (client_id);

create index if not exists idx_office_transactions_created_by
  on public.office_transactions (created_by);

create index if not exists idx_proposals_client_id
  on public.proposals (client_id);

create index if not exists idx_proposals_created_by
  on public.proposals (created_by);

-- A funcao segue disponivel para o event trigger interno ensure_rls,
-- mas deixa de ser chamavel via RPC por anon/authenticated.
revoke execute on function public.rls_auto_enable() from public;
revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.rls_auto_enable() from authenticated;
