# Registro — Gestao Escritorio schema aplicado

- Data/hora: `2026-07-28 21:34`
- Agente: Codex
- Projeto Supabase: `nnckpyzjllqsdcwlnxei`
- Pacote: F9 — Gestao Escritorio e login unificado
- Status: implementado localmente; aguardando revisao; sem commit/push.

## Resumo

Foi aplicada a frente F9 no Hub administrativo: schema de Clientes e Gestao
Escritorio no Supabase real, migracao documentada em Git, hardening de grants,
validacao de RLS, login com selecao de areas, modulo Gestao Escritorio local,
importador unico de JSON do Plena Cash Control e atualizacao de documentacao.

## Banco real

Antes de aplicar, a verificacao por `information_schema` indicou ausencia das
tabelas `clients`, `client_tasks`, `office_categories`,
`office_transactions`, `office_service_items`, `office_service_records`,
`office_cash_closings`, da coluna `profiles.areas` e da funcao
`private.is_staff`.

Depois da aplicacao:

- `list_tables verbose` confirmou `profiles.areas` e as 7 tabelas novas.
- RLS esta ativo nas 7 tabelas de Escritorio.
- Todas as tabelas novas estavam com 0 linhas apos os testes.
- Grants finais para `authenticated`: `DELETE, INSERT, SELECT, UPDATE`.
- Grants para `anon`: nenhum nas tabelas de Escritorio.

## RLS validada

- Staff/admin ficticio `11111111-1111-4111-8111-111111111111`: insert/select em
  `clients` retornou 1 linha em transacao revertida.
- Cliente comum ficticio `22222222-2222-4222-8222-222222222222`: select em
  `clients` retornou 0 linhas.
- Cliente comum ficticio tentando insert: bloqueado com
  `new row violates row-level security policy for table "clients"`.
- Anonimo tentando select: bloqueado com `permission denied for table clients`.
- Residuo de linhas dos testes RLS: 0.

## Advisors

Seguranca: 3 avisos.

- `public.rls_auto_enable()` executavel por `anon`.
- `public.rls_auto_enable()` executavel por `authenticated`.
- leaked password protection desabilitado.

Performance: 18 avisos.

- FKs sem indice em `audit_events`, `clients`, `office_cash_closings`,
  `office_service_records`, `office_transactions` e `proposals`.
- indices ainda sem uso em tabelas novas/recem-criadas e F8.

## Implementacao local

- Criado `/admin/areas` com cards para "Plena Gestao Escritorio" e
  "Plena Gestao Digital".
- Admin sempre ve as duas areas; perfil com uma area e redirecionado direto.
- Criado `/admin/escritorio` com Dashboard, Transacoes, Clientes/tarefas,
  Servicos, Fechamento, Categorias e Importador JSON.
- Criado `/admin/digital/propostas` para manter Propostas separado.
- Rotas antigas `/admin/dashboard`, `/admin/atendimentos` e
  `/admin/relatorios` redirecionam para Escritorio.
- `AdminShell` passou a navegar por areas.
- `supabase-client` passou a carregar `profiles.areas`.
- Tipos TypeScript foram atualizados a partir do schema real gerado pelo MCP.

## Documentacao

- Criada migracao:
  `servicos/supabase/migrations/20260728210000_create_office_management_schema.sql`.
- `servicos/docs/DATA_MODEL.md` atualizado com Gestao Escritorio.
- `servicos/ROADMAP.md` atualizado com "Pacote F9 — Gestao Escritorio e login
  unificado".
- Regra fixa documentada: `clients` e a unica tabela compartilhada; nunca somar
  `office_transactions` com `proposals.investment_amount`.

## Validacoes

- Focados: `npm.cmd run test -- src/features/office src/admin/supabase-client.test.ts src/admin/auth/AdminApp.test.tsx`
  - 4 arquivos, 11 testes aprovados.
- Suite completa: `npm.cmd run test`
  - 63 arquivos; 491 testes aprovados, 8 falharam, 3 pulados.
- Lint: `npm.cmd run lint`
  - aprovado.
- Build: `npm.cmd run build`
  - aprovado.
- `git diff --check`
  - aprovado; apenas aviso de normalizacao CRLF em `servicos/hub/src/App.tsx`.

## Falhas fora do escopo

As 8 falhas da suite completa permanecem em `mei-das-guide`:

- `freight` espera INSS `194.52`, mas o dominio retorna `81.05`;
- testes esperam `sourceUrl` contendo `receita.fazenda.gov.br`, enquanto o
  dominio usa URL `gov.br/empresas-e-negocios`;
- teste de UI espera duas ocorrencias de `194,52`, mas recebe uma.

Nao houve correcao de `mei-das-guide` nesta rodada.

## Observacoes

- Nenhum commit/push foi feito.
- Nenhum link publico foi liberado.
- O build gerou artefatos em `servicos/ferramentas/qr-code/`; os rastreados
  foram restaurados e os bundles nao rastreados gerados foram removidos.
- O Bloco 8 aplicado nao inclui `proposals.client_id`; essa diferenca entre a
  decisao de produto e o schema recebido fica pendente para decisao futura.
