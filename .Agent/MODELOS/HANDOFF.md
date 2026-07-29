# Handoff de tarefa

- Data: `2026-07-28`
- Agente: Codex
- Ferramenta ou area: Hub administrativo / Gestao Escritorio e Digital
- Pacote: F9 - Gestao Escritorio e portais segregados
- Status final: implementado localmente e aguardando revisao; sem commit/push.

## Objetivo entregue

Aplicados os ajustes pendentes de banco no Supabase
`nnckpyzjllqsdcwlnxei`, documentados em migracao Git, e substituido o fluxo de
login unico com seletor por dois portais administrativos segregados:
`/escritorio/login` e `/digital/login`.

## Arquivos criados

- `servicos/supabase/migrations/20260728210000_create_office_management_schema.sql`
- `servicos/supabase/migrations/20260728214000_link_proposals_clients_and_harden_advisors.sql`
- `servicos/hub/src/admin/auth/AreaSelectionPage.test.tsx`
- `servicos/hub/src/admin/auth/AreaSelectionPage.tsx`
- `servicos/hub/src/admin/auth/admin-areas.ts`
- `servicos/hub/src/admin/auth/area-selection-page.css`
- `servicos/hub/src/features/office/domain/office-schema.ts`
- `servicos/hub/src/features/office/services/office-service.ts`
- `servicos/hub/src/features/office/services/office-service.test.ts`
- `servicos/hub/src/features/office/ui/OfficeAreaPage.tsx`
- `servicos/hub/src/features/office/ui/OfficeAreaPage.test.tsx`
- `servicos/hub/src/features/office/ui/office.css`

## Arquivos modificados

- `servicos/hub/src/App.tsx`
- `servicos/hub/src/admin/auth/AdminApp.test.tsx`
- `servicos/hub/src/admin/auth/AuthGuard.tsx`
- `servicos/hub/src/admin/auth/AuthGuard.test.tsx`
- `servicos/hub/src/admin/auth/LoginPage.tsx`
- `servicos/hub/src/admin/auth/LoginPage.test.tsx`
- `servicos/hub/src/admin/auth/login-page.css`
- `servicos/hub/src/admin/shell/AdminShell.tsx`
- `servicos/hub/src/admin/shell/admin-shell.css`
- `servicos/hub/src/admin/supabase-client.ts`
- `servicos/hub/src/admin/supabase-client.test.ts`
- `servicos/hub/src/lib/supabase/database.types.ts`
- `index.html`
- `servicos/servicos.html`
- `servicos/docs/DATA_MODEL.md`
- `servicos/ROADMAP.md`
- `.Agent/MODELOS/HANDOFF.md`

## Logica implementada

- Pagina `/portais` com dois cards completos de login na mesma tela.
- Card "Plena Gestao Escritorio" autentica e abre o sistema do Escritorio.
- Card "Plena Gestao Digital" autentica e abre o sistema Digital.
- Formulario interno de cada card centralizado dentro do respectivo painel.
- Botao "Voltar para a pagina inicial" adicionado em `/portais`.
- Em ambiente local (`127.0.0.1`/`localhost`), o botao volta para
  `http://127.0.0.1:8080/index.html`, porque `5173/index.html` e o
  `index.html` do Vite/Hub, nao o `index.html` institucional da raiz.
- Em producao, o mesmo botao usa `../../../index.html`.
- Textos visiveis do login foram corrigidos com acentuacao:
  `Gestão`, `Escritório`, `Operação`, `serviços`, `recepção`, `próximos`,
  `página`, `inválido`, `não` e `possível`.
- Acesso "Area Administrativa" removido do rodape de `servicos/servicos.html`
  e movido para o rodape de `index.html`, apontando para
  `servicos/ferramentas/qr-code/#/portais`.
- Cada login autentica no Supabase e valida a area solicitada em
  `profiles.areas` ou `role = 'admin'`.
- Perfil sem area recebe mensagem clara e tem a sessao encerrada, sem
  redirecionamento para outro portal.
- Removido o seletor pos-login; rotas antigas `/admin/areas` e `/admin/login`
  redirecionam para a pagina neutra de portais.
- Shell administrativo refeito com sidebar fixa, cabecalho e linguagem visual
  inspirada diretamente no zip Plena Cash Control.
- Gestao Escritorio usa sidebar com Dashboard, Transacoes, Clientes, Servicos,
  Fechamento, Categorias e Importar JSON.
- Gestao Digital usa a mesma familia visual, com Propostas e espaco reservado
  para Clientes tecnologia, Projetos e Catalogo.
- Importador JSON segue admin-only na UI e nao e sincronizador continuo.
- Regra documentada: `office_transactions` e `proposals.investment_amount`
  nunca devem ser somados.

## Banco real

- `proposals.client_id uuid references public.clients(id)` foi adicionado.
- Backfill por e-mail executado com `lower(c.email) = lower(p.client_email)`.
- Resultado do backfill: `proposals_total = 2`,
  `proposals_with_client_id = 0`, `proposals_without_client_id = 2`, porque a
  tabela `clients` estava vazia e nao havia e-mails correspondentes.
- Tipos locais atualizados para incluir `proposals.client_id` e a relacao
  `proposals_client_id_fkey`.

## Advisors e hardening

- Performance antes: 10 avisos reais de FK sem indice:
  `audit_events_actor_user_id_fkey`, `clients_created_by_fkey`,
  `office_cash_closings_closed_by_fkey`,
  `office_service_records_client_id_fkey`,
  `office_service_records_created_by_fkey`,
  `office_service_records_service_item_id_fkey`,
  `office_transactions_client_id_fkey`,
  `office_transactions_created_by_fkey`,
  `proposals_client_id_fkey`, `proposals_created_by_fkey`.
- Correcao aplicada: criados 10 indices `idx_*` correspondentes.
- Performance depois: 0 avisos de FK sem indice. Permanecem 18 avisos de
  `unused_index`, esperados em schema novo/baixo uso e nao removidos.
- Seguranca antes: 3 avisos reais:
  `rls_auto_enable` executavel por `anon`, executavel por `authenticated`, e
  leaked password protection desabilitado.
- `public.rls_auto_enable()` investigada via `information_schema.routines` e
  `pg_proc`: funcao `event_trigger`, `SECURITY DEFINER`, owner `postgres`,
  `search_path = pg_catalog`, usada pelo event trigger `ensure_rls` em
  `ddl_command_end` para habilitar RLS automaticamente em tabelas novas do
  schema `public`.
- `created` e `last_altered` retornaram `null` em `information_schema`; o
  Postgres/Supabase nao expuseram a data de criacao da funcao nessa consulta.
- Dependencia encontrada: event trigger `ensure_rls` chama
  `rls_auto_enable()`.
- Conclusao: a funcao nao precisa de execute via REST/RPC por
  `anon`/`authenticated`; o event trigger continua chamando internamente.
- Revoke aplicado:
  `revoke execute on function public.rls_auto_enable() from public, anon, authenticated`.
- ACL final da funcao: `{postgres=X/postgres,service_role=X/postgres}`.
- Seguranca depois: 1 aviso restante, leaked password protection desabilitado.

## Testes adicionados e ajustados

- Testes de login por portal:
  - pagina `/portais` com dois cards completos de login;
  - renderizacao de login Digital;
  - renderizacao de login Escritorio;
  - validacao de e-mail invalido;
  - sucesso quando perfil tem a area;
  - negacao e logout quando perfil nao tem a area.
- Testes de Gestao Escritorio:
  - importacao JSON do Cash Control sem banco real;
  - criacao de transacao no schema novo;
  - renderizacao do dashboard de Escritorio;
  - criacao de cliente pela UI com mock.
- Testes de AuthGuard e shell ajustados para `/escritorio` e login do portal.

## Validacoes executadas

| Validacao | Resultado |
| --- | --- |
| Testes focados da revisao visual (`AreaSelectionPage`, `LoginPage`) | 2 arquivos, 6 testes aprovados |
| Testes focados de rotas publicadas (`institutional-integration`, `AreaSelectionPage`, `LoginPage`) | 3 arquivos, 16 testes aprovados, 3 pulados |
| Testes focados (`LoginPage`, `AuthGuard`, `AdminApp`, `src/features/office`, `supabase-client`) | 6 arquivos, 20 testes aprovados |
| Suite completa (`npm.cmd run test`) | 63 arquivos; 486 aprovados, 8 falharam, 3 pulados |
| Lint (`npm.cmd run lint`) | aprovado |
| Build (`npm.cmd run build`) | aprovado |

## Falhas fora do F9

- As 8 falhas da suite completa permanecem em `mei-das-guide`:
  `freight` espera INSS `194.52`, sourceUrl com `receita.fazenda.gov.br` e a UI
  espera duas ocorrencias de `194,52`.
- Nao corrigi `mei-das-guide` nesta rodada porque o escopo aprovado era F9 e a
  instrucao era nao expandir esse modulo sem autorizacao.

## Ajustes de publicacao local

- O link publico "Area Administrativa" foi movido para o rodape de
  `index.html` por solicitacao do responsavel.
- A raiz do Hub (`#/`) deixou de redirecionar para QR Code e agora abre
  `/catalogo`.
- O card do QR Code em `servicos/servicos.html` agora aponta explicitamente para
  `ferramentas/qr-code/#/ferramentas/qr-code`.
- O build publicado em `servicos/ferramentas/qr-code/` foi regenerado e mantido
  nesta rodada para que o link da inicial abra `/portais` em vez do bundle
  antigo do QR Code.
- Nao foi feito commit/push.

## Pendencias ou riscos

- Validar visualmente no navegador os dois logins e os shells de Escritorio e
  Digital antes de aprovar commit.
- Os 18 avisos remanescentes de performance sao `unused_index`; acompanhar apos
  uso real antes de remover qualquer indice.
- Leaked password protection segue como ajuste de configuracao no painel Auth
  do Supabase.

## Evidencias Git

- Branch: `main`
- Commit: nao realizado por instrucao do responsavel.
- Push: nao realizado por instrucao do responsavel.
