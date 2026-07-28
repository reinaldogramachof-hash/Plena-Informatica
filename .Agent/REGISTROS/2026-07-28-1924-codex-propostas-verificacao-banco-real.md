# Handoff de tarefa

- Data: `2026-07-28`
- Agente: Codex
- Ferramenta ou area: Hub / Propostas comerciais
- Pacote: F8 - Propostas comerciais
- Status final: Bloqueado na verificacao somente leitura do Supabase real.

## Objetivo da rodada

Confirmar, antes de qualquer alteracao local, que a sessao atual do Codex enxerga
o projeto Supabase `nnckpyzjllqsdcwlnxei` e consegue listar as tabelas reais do
schema `public`.

## Resultado

A verificacao falhou antes do passo 2. Nenhum arquivo de configuracao local foi
alterado, nenhum tipo TypeScript foi gerado e nenhum teste de ponta a ponta foi
executado contra o banco real.

## Evidencias

- `codex mcp get supabase` confirmou a configuracao global com URL contendo
  `project_ref=nnckpyzjllqsdcwlnxei`.
- `codex mcp list` mostrou o MCP `supabase` habilitado e autenticado por OAuth.
- `list_tables` via ferramenta Supabase desta conversa, usando
  `project_id=nnckpyzjllqsdcwlnxei`, retornou `INVALID_ARGUMENT`.
- `execute_sql` somente leitura com `select current_database(), current_schema();`
  usando `project_id=nnckpyzjllqsdcwlnxei` retornou `INVALID_ARGUMENT`.
- `list_projects` via ferramenta Supabase desta conversa ainda retornou apenas:
  - `lxaframzkwmhjiamipsv` / Sistemas de Gestao;
  - `crdtguvjuyfszxbpnwms` / Gestao Saude UBS.

## Passos nao executados por seguranca

- `.env.local` nao foi sobrescrito.
- Tipos TypeScript reais nao foram gerados.
- GRANTs, RLS, advisors e exposicao Data API nao foram verificados.
- Teste funcional com admin, cliente e anonimo nao foi executado.
- `npm.cmd run test`, `npm.cmd run lint` e `npm.cmd run build` nao foram
  repetidos nesta rodada, pois o bloqueio ocorreu no passo 1.

## Pendencia para retomada

Reabrir/recarregar uma sessao Codex em que o namespace Supabase disponivel no
chat seja o MCP recem-configurado para `nnckpyzjllqsdcwlnxei`. A configuracao
global ja aparece correta pelo CLI, mas a ferramenta carregada nesta conversa
permanece presa aos projetos antigos.

## Evidencias Git

- Branch: `main`
- Commit: nao criado
- Push: nao executado
