# Registro - Ajustes de portais e pendencias de banco

- Data: `2026-07-28 22:02`
- Agente: Codex
- Projeto Supabase: `nnckpyzjllqsdcwlnxei`
- Status: ajustes aplicados localmente e no banco real; aguardando revisao; sem commit/push.

## Escopo aprovado

1. Adicionar `proposals.client_id` com backfill por e-mail.
2. Investigar `public.rls_auto_enable()` de forma completa.
3. Revisar os avisos de performance e corrigir FKs sem indice.
4. Substituir login unico com seletor por dois cards completos de login,
   um para Escritorio e outro para Digital.
5. Aproximar shell e Gestao Escritorio do padrao visual do zip Plena Cash
   Control.

## Banco - proposals.client_id

Aplicado no banco real:

```sql
alter table public.proposals
  add column if not exists client_id uuid references public.clients(id);

update public.proposals p
set client_id = c.id
from public.clients c
where p.client_id is null
  and lower(c.email) = lower(p.client_email);
```

Resultado conferido:

- `proposals_total = 2`
- `proposals_with_client_id = 0`
- `proposals_without_client_id = 2`

Motivo: `clients` estava vazia, entao nao havia e-mails para backfill.

## Banco - advisors de performance

Avisos reais de FK sem indice antes da correcao:

1. `public.audit_events.audit_events_actor_user_id_fkey`
2. `public.clients.clients_created_by_fkey`
3. `public.office_cash_closings.office_cash_closings_closed_by_fkey`
4. `public.office_service_records.office_service_records_client_id_fkey`
5. `public.office_service_records.office_service_records_created_by_fkey`
6. `public.office_service_records.office_service_records_service_item_id_fkey`
7. `public.office_transactions.office_transactions_client_id_fkey`
8. `public.office_transactions.office_transactions_created_by_fkey`
9. `public.proposals.proposals_client_id_fkey`
10. `public.proposals.proposals_created_by_fkey`

Indices criados:

- `idx_audit_events_actor_user_id`
- `idx_clients_created_by`
- `idx_office_cash_closings_closed_by`
- `idx_office_service_records_client_id`
- `idx_office_service_records_created_by`
- `idx_office_service_records_service_item_id`
- `idx_office_transactions_client_id`
- `idx_office_transactions_created_by`
- `idx_proposals_client_id`
- `idx_proposals_created_by`

Resultado depois:

- 0 avisos de FK sem indice.
- 18 avisos remanescentes de `unused_index`, mantidos porque o schema e novo ou
  de baixo uso.

## Banco - rls_auto_enable

Definicao conferida via `pg_proc`:

```sql
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
```

Dados conferidos:

- Tipo: `event_trigger`
- Linguagem: `plpgsql`
- Security: `SECURITY DEFINER`
- Owner: `postgres`
- `search_path`: `pg_catalog`
- `created` e `last_altered`: `null` nas consultas disponiveis.
- Dependencia encontrada: event trigger `ensure_rls`, evento
  `ddl_command_end`, chama `rls_auto_enable()`.

Conclusao:

- A funcao habilita RLS automaticamente para novas tabelas no schema `public`.
- O projeto depende dela via event trigger `ensure_rls`.
- Nao ha necessidade operacional de `anon` ou `authenticated` executarem a
  funcao diretamente via RPC.

Revoke aplicado:

```sql
revoke execute on function public.rls_auto_enable() from public;
revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.rls_auto_enable() from authenticated;
```

ACL final: `{postgres=X/postgres,service_role=X/postgres}`.

Advisor de seguranca depois: restou apenas leaked password protection
desabilitado.

## UX - portais segregados

- `/portais`: pagina com dois cards completos de login na mesma tela.
- `/escritorio/login`: login proprio da Gestao Escritorio.
- `/digital/login`: login proprio da Gestao Digital.
- Sem seletor de area apos login.
- Cada login valida a area solicitada no perfil.
- Sem permissao: mensagem clara e logout.
- Admin passa nos dois portais.
- Cada card de `/portais` tem campos de e-mail, senha e botao especifico:
  `Entrar no Escritorio` ou `Entrar no Digital`.

Shell:

- Sidebar fixa inspirada no `components/Layout.tsx` do zip Plena Cash Control.
- Cabecalho interno com data, area e usuario.
- Gestao Escritorio com modulos: Dashboard, Transacoes, Clientes, Servicos,
  Fechamento, Categorias e Importar JSON.
- Gestao Digital na mesma familia visual, com Propostas e espaco para Clientes
  tecnologia, Projetos e Catalogo.

## Validacoes

- Testes focados:
  - comando: `npm.cmd run test -- src/admin/auth/AreaSelectionPage.test.tsx src/admin/auth/LoginPage.test.tsx`
  - resultado: 2 arquivos, 6 testes aprovados.
- Testes focados anteriores:
  - comando: `npm.cmd run test -- src/admin/auth/LoginPage.test.tsx src/admin/auth/AuthGuard.test.tsx src/admin/auth/AdminApp.test.tsx src/features/office src/admin/supabase-client.test.ts`
  - resultado: 6 arquivos, 20 testes aprovados.
- Suite completa:
  - comando: `npm.cmd run test`
  - resultado: 63 arquivos; 486 aprovados, 8 falharam, 3 pulados.
- Lint:
  - comando: `npm.cmd run lint`
  - resultado: aprovado.
- Build:
  - comando: `npm.cmd run build`
  - resultado: aprovado.

## Falhas conhecidas fora do escopo

As 8 falhas da suite completa seguem em `mei-das-guide`:

- dois testes `freight` esperam INSS `194.52`, mas o resultado atual e `81.05`;
- cinco testes de `sourceUrl` esperam dominio `receita.fazenda.gov.br`;
- um teste de UI espera duas ocorrencias de `194,52`, mas encontra uma.

Nao houve correcao em `mei-das-guide` nesta rodada.

## Git

- Branch: `main`
- Commit: nao realizado.
- Push: nao realizado.

## Observacoes

- Nenhum link publico foi liberado.
- O build gerou bundles em `servicos/ferramentas/qr-code/`; os artefatos
  rastreados foram restaurados e os bundles temporarios nao rastreados foram
  removidos.
