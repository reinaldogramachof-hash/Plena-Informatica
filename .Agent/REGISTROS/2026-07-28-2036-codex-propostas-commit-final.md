# Handoff de tarefa

- Data: `2026-07-28`
- Agente: Codex
- Ferramenta ou área: Hub de Serviços / Propostas / Supabase
- Pacote: F8 — Propostas comerciais
- Status final: Commit e push concluídos em `main`.

## Objetivo entregue

Fechar a entrega do módulo Propostas antes do commit/push, resolvendo o bloqueio
de build com uma correção mínima em `ActivityType`, investigando
`public.rls_auto_enable()` sem alterar a função, confirmando a migração
documentada de hardening e publicando o commit autorizado.

## Arquivos criados

- `servicos/hub/src/features/proposals/domain/proposal-schema.ts`
- `servicos/hub/src/features/proposals/domain/proposal-schema.test.ts`
- `servicos/hub/src/features/proposals/services/proposal-service.ts`
- `servicos/hub/src/features/proposals/services/proposal-service.test.ts`
- `servicos/hub/src/features/proposals/ui/AdminProposalsPage.tsx`
- `servicos/hub/src/features/proposals/ui/AdminProposalsPage.test.tsx`
- `servicos/hub/src/features/proposals/ui/ClientProposalPage.tsx`
- `servicos/hub/src/features/proposals/ui/ClientProposalPage.test.tsx`
- `servicos/hub/src/features/proposals/ui/proposals.css`
- `servicos/hub/src/lib/supabase/database.types.ts`
- `servicos/supabase/migrations/20260728181000_create_private_schema.sql`
- `servicos/supabase/migrations/20260728181100_create_profiles.sql`
- `servicos/supabase/migrations/20260728181200_create_proposals.sql`
- `servicos/supabase/migrations/20260728181300_create_audit_events.sql`
- `servicos/supabase/migrations/20260728181400_create_consent_records_and_proposal_acceptance.sql`
- `servicos/supabase/migrations/20260728202100_harden_proposals_rls_grants.sql`
- `.Agent/REGISTROS/2026-07-28-1804-codex-propostas-bloqueio-supabase.md`
- `.Agent/REGISTROS/2026-07-28-1849-codex-propostas-implementacao-local.md`
- `.Agent/REGISTROS/2026-07-28-1924-codex-propostas-verificacao-banco-real.md`
- `.Agent/REGISTROS/2026-07-28-1953-codex-propostas-validacao-final.md`
- `.Agent/REGISTROS/2026-07-28-2036-codex-propostas-commit-final.md`

## Arquivos modificados

- `servicos/ROADMAP.md`
- `servicos/docs/DATA_MODEL.md`
- `servicos/hub/index.html`
- `servicos/hub/src/App.tsx`
- `servicos/hub/src/admin/shell/AdminShell.tsx`
- `servicos/hub/src/admin/supabase-client.ts`
- `servicos/hub/src/features/tools/mei-das-guide/domain/das-values.ts`

## Lógica implementada

- Admin `/admin/propostas` com criação, listagem e envio de propostas.
- Fluxo cliente em `/propostas` com magic link, visualização e aceite via
  `insert` em `consent_records`.
- Migrações documentais do schema de Propostas e hardening de RLS/grants.
- Tipos TypeScript reais gerados do schema Supabase vivo.
- Título do Hub alterado para `Hub Plena | Administração`.
- Dívida técnica registrada: publicação do Hub ainda em `ferramentas/qr-code/`.
- Correção mínima do build: adicionado `'freight'` ao union `ActivityType`, sem
  alterar lógica/valores do `mei-das-guide`.

## Investigação read-only

`public.rls_auto_enable()`:

- É função `plpgsql`, `SECURITY DEFINER`, owner `postgres`.
- Retorna `event_trigger`.
- Está com `search_path` fixo em `pg_catalog`.
- ACL real: `anon`, `authenticated`, `service_role` e `postgres` têm `EXECUTE`.
- É usada pelo event trigger `ensure_rls`.
- `ensure_rls` está ativo (`evtenabled = 'O'`) em `ddl_command_end`.
- Tags do event trigger: `CREATE TABLE`, `CREATE TABLE AS`, `SELECT INTO`.
- A função percorre `pg_event_trigger_ddl_commands()` e, quando uma tabela é
  criada no schema `public`, executa `alter table if exists <objeto> enable row
  level security`.
- Não encontrei referência local a `rls_auto_enable` nas migrações do pacote;
  as migrações documentadas habilitam RLS explicitamente em cada tabela.
- Não foi possível obter data de criação: `pg_proc` e `pg_event_trigger` não
  expõem coluna temporal de criação.
- Nenhum grant, revoke ou alteração foi aplicado nessa função nesta rodada.

## Testes adicionados

- Testes de schema de propostas.
- Testes do serviço de propostas com mocks Supabase.
- Testes da página admin de propostas.
- Testes da página cliente de propostas.

## Validações executadas

| Validação | Resultado |
| --- | --- |
| `npm.cmd run test` | 61 arquivos; 57 passaram e 4 falharam; 498 testes; 485 passaram, 10 falharam, 3 ignorados; duração 111.98s |
| `npm.cmd run lint` | aprovado |
| `npm.cmd run build` | aprovado; Vite gerou build em `../ferramentas/qr-code` durante validação, mas os assets gerados foram removidos/restaurados para não ampliar o escopo público do commit |
| `git diff --check` | aprovado |

## Resultado das falhas de teste

Falhas restantes estão fora do pacote Propostas:

- `mei-das-guide/domain/das-values.test.ts`: expectativas de `freight` com INSS
  `194.52` e `sourceUrl` contendo `receita.fazenda.gov.br`, enquanto a lógica
  atual retorna `81.05` e URL `gov.br`.
- `mei-das-guide/ui/MeiDasGuideTool.test.tsx`: expectativa de duas ocorrências
  de `194,52`.
- Timeouts intermitentes apareceram nesta execução em
  `declaration-builder/ui/DeclarationBuilderTool.test.tsx` e
  `label-generator/domain/create-labels-pdf.test.ts`.

## Teste local

1. Abrir `http://127.0.0.1:5173/#/admin/login`.
2. Entrar com usuário em `profiles.role = 'admin'`.
3. Acessar `#/admin/propostas`.
4. Criar e enviar proposta fictícia.
5. Acessar `#/propostas` como cliente autenticado por magic link.
6. Aceitar a proposta.

## Ajustes fora do escopo

- Nenhuma alteração foi feita em `vite.config.ts`.
- Nenhum link público foi liberado.
- Assets de build em `servicos/ferramentas/qr-code/` não foram incluídos no
  commit.
- A investigação de `public.rls_auto_enable()` não foi incluída no commit.

## Pendências ou riscos

- `public.rls_auto_enable()` permanece com `EXECUTE` para `anon` e
  `authenticated`; decisão pendente.
- Leaked password protection segue como pendência de configuração no Supabase
  Auth.
- Falhas de teste restantes em `mei-das-guide` e timeouts intermitentes seguem
  fora do escopo deste commit.

## Evidências Git

- Branch: `main`
- Commit: `fb597f8`
- Push: confirmado para `origin/main`
- Saída do push: `6caafa9..fb597f8  main -> main`
