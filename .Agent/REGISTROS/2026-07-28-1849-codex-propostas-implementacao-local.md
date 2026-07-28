# Handoff de tarefa

- Data: `2026-07-28`
- Agente: Codex
- Ferramenta ou area: Hub / Propostas comerciais
- Pacote: F8 - Propostas comerciais
- Status final: Implementacao local entregue com pendencias externas de Supabase e baseline.

## Objetivo entregue

Implementar o modulo Propostas sem executar DDL no Supabase: migracoes
equivalentes documentadas em Git, modelo de dados atualizado, roadmap atualizado,
rota administrativa `/admin/propostas`, fluxo do cliente em `/propostas`,
magic link, visualizacao da proposta propria e aceite via `insert` em
`consent_records`.

## Arquivos criados

- `servicos/supabase/migrations/20260728181000_create_private_schema.sql`
- `servicos/supabase/migrations/20260728181100_create_profiles.sql`
- `servicos/supabase/migrations/20260728181200_create_proposals.sql`
- `servicos/supabase/migrations/20260728181300_create_audit_events.sql`
- `servicos/supabase/migrations/20260728181400_create_consent_records_and_proposal_acceptance.sql`
- `servicos/hub/src/features/proposals/domain/proposal-schema.ts`
- `servicos/hub/src/features/proposals/domain/proposal-schema.test.ts`
- `servicos/hub/src/features/proposals/services/proposal-service.ts`
- `servicos/hub/src/features/proposals/services/proposal-service.test.ts`
- `servicos/hub/src/features/proposals/ui/AdminProposalsPage.tsx`
- `servicos/hub/src/features/proposals/ui/AdminProposalsPage.test.tsx`
- `servicos/hub/src/features/proposals/ui/ClientProposalPage.tsx`
- `servicos/hub/src/features/proposals/ui/ClientProposalPage.test.tsx`
- `servicos/hub/src/features/proposals/ui/proposals.css`

## Arquivos modificados

- `servicos/docs/DATA_MODEL.md`
- `servicos/ROADMAP.md`
- `servicos/hub/src/App.tsx`
- `servicos/hub/src/admin/shell/AdminShell.tsx`

## Logica implementada

- Admin lista propostas via `proposals`.
- Admin cria proposta em `draft` com dados estruturados de cliente, escopo,
  tecnologia, investimento, prazo e validade.
- Admin envia proposta alterando `draft` para `sent` e preenchendo `sent_at`.
- Navegacao administrativa ganhou item `Propostas`.
- Cliente acessa `/propostas` fora do AuthGuard administrativo.
- Cliente solicita magic link via `signInWithOtp`.
- Cliente autenticado lista propostas retornadas pelo Supabase/RLS.
- Cliente aceita proposta inserindo somente em `consent_records`.
- UI captura `navigator.userAgent`; `ip_address` fica `null` no cliente.
- Apos aceite, a UI recarrega a proposta ou reflete `accepted` localmente se a
  leitura posterior falhar.

## Testes adicionados

- 12 testes focados:
  - schema e normalizacao de proposta;
  - servico Supabase com mocks;
  - criacao/envio no admin;
  - magic link, listagem e aceite do cliente.

## Validacoes executadas

| Validacao | Resultado |
| --- | --- |
| `npm.cmd run test -- src/features/proposals` | Aprovado: 4 arquivos, 12 testes |
| `npm.cmd run test` | Falhou fora do pacote: 8 falhas em `mei-das-guide` |
| `npm.cmd run lint` | Aprovado |
| `npm.cmd run build` | Falhou fora do pacote: erros TypeScript em `mei-das-guide` |
| `git diff --check` | Aprovado |
| Supabase MCP `list_projects` | Projeto `nnckpyzjllqsdcwlnxei` nao listado |
| Supabase MCP `list_tables` em `nnckpyzjllqsdcwlnxei` | Falhou com `INVALID_ARGUMENT` |

## Teste local

1. Abrir o Hub local.
2. Acessar `#/admin/propostas` com usuario admin autenticado.
3. Criar uma proposta ficticia.
4. Clicar em `Enviar` para mudar `draft` para `sent`.
5. Acessar `#/propostas`.
6. Solicitar magic link com o e-mail do cliente ficticio.
7. Entrar pelo link recebido.
8. Conferir a proposta visivel e clicar em `Aceitar proposta`.

## Ajustes fora do escopo

- Nenhum ajuste funcional fora do pacote Propostas.
- O arquivo `__local-site-server.mjs` e o registro anterior de bloqueio ja
  estavam no workspace antes desta implementacao e foram preservados.

## Pendencias ou riscos

- `.env.local` nao foi sobrescrito porque o briefing exige confirmacao do
  responsavel antes de alterar credenciais locais existentes.
- Tipos TypeScript reais do Supabase nao foram gerados: o CLI `supabase` nao
  esta disponivel no PATH e o MCP nao acessa o projeto `nnckpyzjllqsdcwlnxei`.
- O servico usa casts temporarios no mesmo padrao de `transaction-service` ate
  os tipos reais serem gerados.
- Suite completa e build continuam bloqueados por erros existentes no pacote
  `mei-das-guide`, nao relacionados a Propostas.
- Nenhum link publico foi liberado em `servicos/servicos.html`.

## Evidencias Git

- Branch: `main`
- Commit: nao criado
- Push: nao executado
