-- Remove por completo o schema do modulo "Gestao Escritorio" (painel admin).
-- APLICAR MANUALMENTE no SQL Editor do Supabase (nao executado automaticamente).
--
-- Contexto: em 2026-07-30 o codigo do painel administrativo (login, /portais,
-- Gestao Escritorio, Gestao Digital/AdminProposalsPage) foi removido do Hub.
-- Foram mantidos: o catalogo publico, as 11 ferramentas (QR Code, unir PDF etc.)
-- e o fluxo publico de propostas comerciais (ClientProposalPage). Este script
-- derruba apenas as tabelas que existiam exclusivamente para o painel removido.
--
-- NAO remove: public.proposals, public.consent_records, public.audit_events,
-- public.profiles (ainda usados pelo fluxo publico de propostas e pelo login
-- via magic link).

begin;

drop table if exists public.client_tasks cascade;
drop table if exists public.office_transactions cascade;
drop table if exists public.office_service_records cascade;
drop table if exists public.office_cash_closings cascade;
drop table if exists public.office_service_items cascade;
drop table if exists public.office_categories cascade;

-- CASCADE remove tambem a constraint public.proposals.client_id -> public.clients.id
-- criada em 20260728214000. A coluna client_id continua existindo em proposals,
-- apenas sem a foreign key (nao e usada pelo fluxo publico ClientProposalPage).
drop table if exists public.clients cascade;

-- Funcao usada somente pelas policies RLS das tabelas acima.
drop function if exists private.is_staff(uuid);

commit;

-- Deixado de fora deste script, por serem de baixo risco/fora do escopo do painel admin:
--   * a coluna public.profiles.areas (ficou orfa, mas inofensiva). Para remover tambem:
--       alter table public.profiles drop column if exists areas;
--   * public.proposals.client_id (coluna orfa apos o cascade acima, sem FK). Para remover:
--       alter table public.proposals drop column if exists client_id;
--   * regenerar servicos/hub/src/lib/supabase/database.types.ts (os tipos das tabelas
--     removidas ficam obsoletos no arquivo, mas nao sao mais importados por nenhum
--     codigo, entao nao quebram o build).
