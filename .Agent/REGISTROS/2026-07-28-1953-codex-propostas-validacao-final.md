# Handoff de tarefa

- Data: `2026-07-28`
- Agente: Codex
- Ferramenta ou área: Hub de Serviços / Supabase / Propostas
- Pacote: F8 — Propostas comerciais
- Status final: Banco real endurecido e validado; build segue bloqueado por `mei-das-guide`.

## Objetivo entregue

Retomada da validação final do pacote Propostas no projeto Supabase
`nnckpyzjllqsdcwlnxei`, com evidência real de schema, grants, advisors, RLS,
aceite via `consent_records`, tipos TypeScript gerados do schema vivo e
validações locais do Hub.

## Arquivos criados

- `servicos/hub/src/lib/supabase/database.types.ts`
- `servicos/supabase/migrations/20260728202100_harden_proposals_rls_grants.sql`
- `.Agent/REGISTROS/2026-07-28-1953-codex-propostas-validacao-final.md`

## Arquivos modificados

- `servicos/hub/index.html`
- `servicos/ROADMAP.md`
- `servicos/hub/src/admin/supabase-client.ts`
- `servicos/hub/src/features/proposals/services/proposal-service.ts`

## Lógica implementada

- Título do Hub alterado de `Gerador de QR Code | Plena Informática` para
  `Hub Plena | Administração`.
- Dívida técnica registrada no ROADMAP: o Hub ainda publica em
  `servicos/ferramentas/qr-code/` e essa base não deve ser alterada sem decisão
  arquitetural específica.
- Tipos TypeScript reais gerados pelo MCP Supabase e adicionados ao Hub.
- `createClient` tipado com `Database`.
- `ProposalRow` passou a usar `Tables<'proposals'>` em vez de shape manual.
- Aplicado SQL autorizado para apertar GRANTs, corrigir `role` do admin real,
  fixar `search_path` de `private.set_updated_at` e otimizar policies RLS.

## Verificação do banco real

### list_tables verbose

Resultado real do schema `public` no MCP Supabase:

- `public.profiles`
  - RLS: `true`
  - linhas: `1` antes dos usuários fictícios de teste
  - colunas reais: `id uuid`, `email text`, `display_name text null`,
    `role text default 'cliente' check admin/recepcao/cliente`,
    `created_at timestamptz default now()`, `updated_at timestamptz default now()`
  - PK: `id`
  - FK: `profiles.id -> auth.users.id`
- `public.proposals`
  - RLS: `true`
  - linhas: `0` antes das propostas fictícias
  - colunas reais: `id uuid default gen_random_uuid()`, `client_name text`,
    `client_email text`, `client_user_id uuid null`, `title text`,
    `scope_included jsonb default []`, `scope_excluded jsonb default []`,
    `tech_stack jsonb default []`, `investment_amount numeric`, `currency text
    default 'BRL'`, `estimated_timeline text null`, `status text default
    'draft' check draft/sent/accepted/declined`, `version integer default 1`,
    `valid_until date null`, `created_by uuid null`, `created_at timestamptz`,
    `updated_at timestamptz`, `sent_at timestamptz null`, `accepted_at
    timestamptz null`
  - PK: `id`
  - FKs: `created_by -> profiles.id`, `client_user_id -> auth.users.id`
- `public.consent_records`
  - RLS: `true`
  - linhas: `0` antes do aceite fictício
  - colunas reais: `id uuid default gen_random_uuid()`, `user_id uuid`,
    `document_type text`, `document_id uuid null`, `document_version integer`,
    `accepted_at timestamptz default now()`, `ip_address text null`,
    `user_agent text null`
  - PK: `id`
  - FK: `user_id -> auth.users.id`
- `public.audit_events`
  - RLS: `true`
  - linhas: `0` antes do aceite fictício
  - colunas reais: `id bigint identity always`, `actor_user_id uuid null`,
    `action text`, `resource_type text`, `resource_id text null`,
    `metadata jsonb null`, `created_at timestamptz default now()`
  - PK: `id`
  - FK: `actor_user_id -> auth.users.id`

### Grants reais

Consulta em `information_schema.role_table_grants` mostrou grants amplos demais
para `anon` e `authenticated` nas quatro tabelas. Exemplos reais:

- `anon` possui `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`,
  `REFERENCES`, `TRIGGER` em `profiles`, `proposals`, `consent_records` e
  `audit_events`.
- `authenticated` também possui `SELECT`, `INSERT`, `UPDATE`, `DELETE`,
  `TRUNCATE`, `REFERENCES`, `TRIGGER` nessas tabelas.

Após autorização do responsável, foi aplicado SQL de endurecimento. Rechecagem
real em `information_schema.role_table_grants` retornou somente:

- `authenticated SELECT` em `audit_events`
- `authenticated INSERT, SELECT` em `consent_records`
- `authenticated SELECT, UPDATE` em `profiles`
- `authenticated INSERT, SELECT, UPDATE` em `proposals`

Não apareceu nenhum grant para `anon` nas quatro tabelas.

### Policies reais

Policies retornadas por `pg_policies`:

- `profiles_select`: `((auth.uid() = id) OR private.is_admin(auth.uid()))`
- `profiles_update_admin_only`: `private.is_admin(auth.uid())`
- `proposals_admin_write`: `ALL`, `USING private.is_admin(auth.uid())`, `WITH CHECK private.is_admin(auth.uid())`
- `proposals_select`: `((client_user_id = auth.uid()) OR private.is_admin(auth.uid()))`
- `consent_insert_own`: `WITH CHECK (user_id = auth.uid())`
- `consent_select`: `((user_id = auth.uid()) OR private.is_admin(auth.uid()))`
- `audit_select_admin_only`: `private.is_admin(auth.uid())`

Observação: as policies estão com `roles = {public}`, não restritas diretamente
com `TO authenticated`.

### Triggers reais

- `consent_records.trg_consent_apply`: `AFTER INSERT EXECUTE FUNCTION private.apply_proposal_consent()`
- `profiles.trg_profiles_updated_at`: `BEFORE UPDATE EXECUTE FUNCTION private.set_updated_at()`
- `proposals.trg_proposals_updated_at`: `BEFORE UPDATE EXECUTE FUNCTION private.set_updated_at()`

### Funções relevantes

- `private.apply_proposal_consent()` é `SECURITY DEFINER` com
  `SET search_path TO 'public'`; atualiza `proposals` para `accepted` quando
  `document_type = 'proposal'`, `client_user_id = new.user_id` e status está
  `sent`; depois insere `audit_events`.
- `private.is_admin(uid uuid)` é `SECURITY DEFINER` com
  `SET search_path TO 'public'`; consulta `public.profiles.role = 'admin'`.
- `private.set_updated_at()` não tem `search_path` fixo.

### Achado operacional

O perfil real `tecnologia@plenainformatica.com.br` foi atualizado para
`role = 'admin'` e rechecado no banco.

## Advisors

### Segurança

Alertas reais antes do endurecimento:

- `function_search_path_mutable` em `private.set_updated_at`
  - Remediação: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable
- `anon_security_definer_function_executable` em `public.rls_auto_enable()`
  - Remediação: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
- `authenticated_security_definer_function_executable` em `public.rls_auto_enable()`
  - Remediação: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- `auth_leaked_password_protection`
  - Proteção contra senhas vazadas está desabilitada.
  - Remediação: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

Após o endurecimento, o advisor de segurança deixou de reportar
`function_search_path_mutable` em `private.set_updated_at`. Permaneceram:

- `anon_security_definer_function_executable` em `public.rls_auto_enable()`
- `authenticated_security_definer_function_executable` em `public.rls_auto_enable()`
- `auth_leaked_password_protection`

### Performance

Alertas reais antes do endurecimento:

- `unindexed_foreign_keys`
  - `public.audit_events.audit_events_actor_user_id_fkey`
  - `public.proposals.proposals_created_by_fkey`
- `auth_rls_initplan`
  - `profiles_select`
  - `profiles_update_admin_only`
  - `proposals_select`
  - `proposals_admin_write`
  - `consent_insert_own`
  - `consent_select`
  - `audit_select_admin_only`
- `unused_index`
  - `idx_profiles_role`
  - `idx_consent_records_user_id`
  - `idx_consent_records_document`
  - `idx_proposals_client_user_id`
  - `idx_proposals_status`
  - `idx_audit_events_resource`
- `multiple_permissive_policies`
  - `public.proposals` com policies permissivas múltiplas para `SELECT`,
    incluindo `{proposals_admin_write, proposals_select}` em vários roles
    reportados pelo advisor.

Após o endurecimento, sumiram os alertas de `auth_rls_initplan` e
`multiple_permissive_policies`. Permaneceram:

- `unindexed_foreign_keys`
  - `public.audit_events.audit_events_actor_user_id_fkey`
  - `public.proposals.proposals_created_by_fkey`
- `unused_index`
  - `idx_profiles_role`
  - `idx_consent_records_user_id`
  - `idx_proposals_client_user_id`

## Teste funcional com dados fictícios

Usuários fictícios criados via DML para validação:

- `codex.admin.propostas@example.test` com `role = 'admin'`
- `codex.cliente.a@example.test` com `role = 'cliente'`
- `codex.cliente.b@example.test` com `role = 'cliente'`

Propostas fictícias criadas/enviadas como admin de teste:

- `aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa`
  - cliente A
  - status inicial: `sent`
- `bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb`
  - cliente B
  - status inicial: `sent`

### Evidência RLS antes do endurecimento

Consultas executadas com `set local role authenticated` e
`request.jwt.claim.sub` por usuário:

- Admin de teste:
  - `visible_count = 2`
  - viu as propostas A e B.
- Cliente A:
  - `visible_count = 1`
  - viu somente `aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa`.
- Cliente B:
  - `visible_count = 1`
  - viu somente `bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb`.
- Anônimo:
  - `visible_count = 0`
  - `visible_rows = null`.

### Evidência RLS após o endurecimento

Consultas repetidas após `REVOKE/GRANT` e recriação das policies:

- Admin de teste:
  - `visible_count = 2`
  - viu propostas A e B.
- Cliente A:
  - `visible_count = 1`
  - viu somente a proposta A, já `accepted`.
- Cliente B:
  - `visible_count = 1`
  - viu somente a proposta B, então `sent`.
- Anônimo:
  - retornou erro esperado de permissão:
    `permission denied for table proposals`.
  - Isso confirma ausência de grant para `anon`.

### Evidência do aceite

Aceite executado como cliente A, inserindo apenas em `public.consent_records`.

Resultado do insert:

- `consent_records.id = 32bf1144-eb81-415f-b123-d4c6ff2e3e8a`
- `user_id = 22222222-2222-4222-8222-222222222222`
- `document_type = proposal`
- `document_id = aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa`
- `document_version = 1`
- `accepted_at = 2026-07-28T22:48:14.568217+00:00`
- `ip_address = null`
- `user_agent = Codex final validation SQL simulated client session`

Confirmação da proposta:

- `proposals.id = aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa`
- `status = accepted`
- `accepted_at = 2026-07-28 22:48:14.568217+00`
- `version = 1`

Confirmação da auditoria:

- `audit_events.id = 1`
- `actor_user_id = 22222222-2222-4222-8222-222222222222`
- `action = proposal_accepted`
- `resource_type = proposal`
- `resource_id = aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa`
- `metadata.consent_record_id = 32bf1144-eb81-415f-b123-d4c6ff2e3e8a`
- `metadata.document_version = 1`

### Evidência do aceite após o endurecimento

Aceite executado como cliente B, inserindo apenas em `public.consent_records`.

Resultado do insert:

- `consent_records.id = 71d4b62b-6096-4cea-9ce9-f7f0afb339cd`
- `user_id = 33333333-3333-4333-8333-333333333333`
- `document_type = proposal`
- `document_id = bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb`
- `document_version = 1`
- `accepted_at = 2026-07-28T23:21:43.724003+00:00`
- `ip_address = null`
- `user_agent = Codex post-grant-tightening validation SQL simulated client session`

Confirmação da proposta:

- `proposals.id = bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb`
- `status = accepted`
- `accepted_at = 2026-07-28 23:21:43.724003+00`

Confirmação da auditoria:

- `audit_events.id = 2`
- `actor_user_id = 33333333-3333-4333-8333-333333333333`
- `action = proposal_accepted`
- `resource_type = proposal`
- `resource_id = bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb`
- `metadata.consent_record_id = 71d4b62b-6096-4cea-9ce9-f7f0afb339cd`
- `metadata.document_version = 1`

Limite da validação: o clique real no magic link de e-mail não foi validado por
falta de acesso à caixa de entrada do cliente fictício. A solicitação de magic
link está implementada na UI, e o fluxo de sessão/RLS/aceite foi validado no
banco com papel `authenticated` e usuário fictício.

## Testes adicionados

Sem novos testes nesta rodada final. Os testes de propostas já existentes foram
executados novamente.

## Validações executadas

| Validação | Resultado |
| --- | --- |
| `npm.cmd run test -- src/features/proposals` | Pós-SQL: 4 arquivos aprovados; 12 testes aprovados; duração 6.48s |
| `npm.cmd run test` | Pós-SQL: 61 arquivos; 59 aprovados e 2 falharam; 498 testes totais; 487 aprovados, 8 falharam, 3 ignorados; duração 41.69s |
| `npm.cmd run lint` | aprovado sem erros |
| `npm.cmd run build` | falhou em `mei-das-guide` antes do Vite build |
| `git diff --check` | aprovado sem saída |

## Diagnóstico das falhas fora de Propostas

Nenhum diff foi encontrado nos diretórios:

- `servicos/hub/src/features/tools/mei-das-guide`
- `servicos/hub/src/features/tools/label-generator`
- `servicos/hub/src/features/tools/print-cost-estimator`
- `servicos/hub/src/features/tools/resume-builder`

Assim, as falhas abaixo são pré-existentes em relação a esta rodada final e não
foram introduzidas pelas mudanças de Propostas/título/tipos/SQL:

- `mei-das-guide/domain/das-values.test.ts`
  - 7 falhas: `freight` espera INSS `194.52`, código retorna `81.05`;
    `sourceUrl` espera `receita.fazenda.gov.br`, código usa `gov.br`.
- `mei-das-guide/ui/MeiDasGuideTool.test.tsx`
  - 1 falha: espera duas ocorrências de `194,52`, recebeu uma.
Na rodada pós-SQL, os timeouts de `label-generator`, `print-cost-estimator` e
`resume-builder` não se repetiram.

Build falhou com 4 erros TypeScript em `mei-das-guide`:

- `das-values.test.ts(11,75)`: `"freight"` não é atribuível a `ActivityType`.
- `das-values.test.ts(18,26)`: comparação sem overlap entre `ActivityType` e `"freight"`.
- `das-values.test.ts(85,46)`: `"freight"` não é parâmetro válido de `ActivityType`.
- `MeiDasGuideTool.tsx(134,8)`: comparação sem overlap entre `ActivityType | null` e `"freight"`.

## Teste local

1. Acessar `http://127.0.0.1:5173/#/admin/login`.
2. Entrar com usuário que tenha `profiles.role = 'admin'`.
3. Abrir `#/admin/propostas`.
4. Criar proposta fictícia.
5. Enviar proposta.
6. Acessar o fluxo cliente em `#/propostas` após autenticação por magic link.
7. Aceitar a proposta e conferir status `accepted`.

## Ajustes fora do escopo

- DDL/GRANT/REVOKE autorizado foi aplicado no banco real e documentado em
  migração Git.
- Foram criados dados fictícios de teste no banco real para validar RLS e aceite.
- Não foi alterado `servicos/hub/vite.config.ts`.
- Não foi alterado o caminho público `servicos/ferramentas/qr-code/`.
- Não foi liberado link público institucional.

## Pendências ou riscos

- `public.rls_auto_enable()` segue reportado pelo advisor como função
  `SECURITY DEFINER` executável por `anon` e `authenticated`.
- Leaked password protection segue desativado no Auth.
- Restam alertas de performance para FKs sem índice e alguns índices não usados.
- Advisors de segurança e performance possuem alertas relevantes listados acima.
- Magic link não foi validado por clique real em e-mail nesta rodada.
- Suíte completa e build seguem bloqueados por falhas pré-existentes fora de
  Propostas, principalmente `mei-das-guide`.
- Dados fictícios criados no banco real podem ser removidos depois da auditoria,
  se o responsável quiser limpar o ambiente.

## Evidências Git

- Branch: `main`
- Commit: não criado.
- Push: não executado.
