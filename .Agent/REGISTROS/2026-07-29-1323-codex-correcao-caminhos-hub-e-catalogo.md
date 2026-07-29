# Registro de acao

## Identificacao

- Data: `2026-07-29`
- Horario e fuso: `13:23 America/Sao_Paulo`
- Agente: Codex
- Pacote ou tarefa: Correcao de caminhos publicados do Hub e fechamento da rota orfa `/catalogo`
- Solicitacao de origem: Ajustar o Hub para sair do endereco fisico `servicos/ferramentas/qr-code`, atualizar links institucionais/testes, manter redirect de transicao e confirmar read-only o estado do login no projeto Supabase `nnckpyzjllqsdcwlnxei`
- Branch: `main`

## Escopo

- Objetivo:
  - trocar o `outDir` publicado do Hub para um caminho neutro;
  - atualizar `index.html` e `servicos/servicos.html` para o novo endereco;
  - ajustar a suite `institutional-integration`;
  - deixar redirect leve no caminho legado `servicos/ferramentas/qr-code/`;
  - redirecionar `/catalogo` para `/servicos/servicos.html` via `window.location.href`;
  - tentar confirmar em leitura se `reinaldogramachof@gmail.com` existe no projeto Supabase `nnckpyzjllqsdcwlnxei`.
- Arquivos permitidos:
  - `servicos/hub/vite.config.ts`
  - `index.html`
  - `servicos/servicos.html`
  - `servicos/hub/src/App.tsx`
  - `servicos/hub/src/app/institutional-integration.test.tsx`
  - `servicos/ferramentas/qr-code/index.html`
  - `servicos/hub/src/app/catalog-redirect.tsx`
  - `servicos/hub/src/app/catalog-redirect-target.ts`
  - `.Agent/REGISTROS/2026-07-29-1323-codex-correcao-caminhos-hub-e-catalogo.md`
- Arquivos reservados:
  - arquivos centrais nao citados acima, especialmente schema/migrations e modulos fora do escopo desta rodada
- Criterios de aceite:
  - build gerando bundle em `servicos/hub-app/`;
  - links institucionais apontando para o novo caminho;
  - redirect legado evitando 404 no endereco antigo;
  - rota `/catalogo` deixando de abrir catalogo interno do SPA;
  - teste institucional ajustado e suite voltando ao baseline conhecido de `mei-das-guide`;
  - lint aprovado;
  - nenhuma alteracao de banco alem de consulta read-only, se o acesso estivesse disponivel.

## Estado inicial

- Git:
  - branch `main`
  - modificacoes nao relacionadas ausentes na area de trabalho do escopo
  - nao rastreados presentes antes da rodada: `.Agent/REGISTROS/2026-07-29-1251-codex-preparacao-ambiente-validacao-visual.md`, `AUDITORIA-PAINEL-ADMIN-GESTAO-PLENA.md`, `__local-site-server.mjs`, `graphify-out/`
- Testes:
  - historico recente apontava baseline esperado de `486` aprovados, `8` falhas conhecidas em `mei-das-guide`, `3` pulados antes desta rodada
- Lint:
  - esperado limpo
- Build:
  - caminho de saida ainda configurado como `../ferramentas/qr-code`
- Riscos conhecidos:
  - o admin inteiro ainda estava fisicamente servido em `servicos/ferramentas/qr-code`
  - a sessao Supabase deste chat ja havia mostrado historico de enxergar projetos errados ou incompletos

## Acoes realizadas

1. Confirmei `git status -sb`, branch atual e reli o contexto recente de memoria/skill para nao repetir diagnostico antigo.
2. Mapeei as ocorrencias do caminho legado em `vite.config.ts`, `index.html`, `servicos/servicos.html`, `App.tsx` e `institutional-integration.test.tsx`.
3. Troquei o caminho publicado do Hub para `servicos/hub-app` via `outDir: '../hub-app'`.
4. Atualizei o link "Area Administrativa" do rodape de `index.html` para `servicos/hub-app/#/portais`.
5. Atualizei os cards da vitrine em `servicos/servicos.html` que ainda apontavam para `ferramentas/qr-code/#/ferramentas/...`, passando-os para `hub-app/#/ferramentas/...`.
6. Removi o catalogo interno do SPA de `App.tsx` e passei a usar um redirect dedicado de `/catalogo` para `/servicos/servicos.html` via `window.location.href`.
7. Extraí a logica do redirect para `catalog-redirect-target.ts` e o componente para `catalog-redirect.tsx`, mantendo `App.tsx` enxuto e sem aviso de fast refresh no lint.
8. Ajustei `institutional-integration.test.tsx` para o novo caminho publicado e para validar a montagem do redirect do catalogo sem depender de navegacao real do JSDOM.
9. Substitui `servicos/ferramentas/qr-code/index.html` por uma pagina leve de transicao com `meta refresh` e `window.location.replace('../../hub-app/' + hash)`.
10. Rodei build, test e lint apos as mudancas finais.
11. Validei por HTTP local que:
   - `http://127.0.0.1:8080/` respondeu `200` e ja contem o link para `servicos/hub-app/#/portais`;
   - `http://127.0.0.1:8080/servicos/hub-app/` respondeu `200`;
   - `http://127.0.0.1:8080/servicos/ferramentas/qr-code/` respondeu `200` com a pagina de redirect legado.
12. Tentei a consulta read-only no Supabase:
   - `list_projects` do conector desta sessao mostrou apenas `lxaframzkwmhjiamipsv` e `crdtguvjuyfszxbpnwms`;
   - a consulta explicita em `nnckpyzjllqsdcwlnxei` retornou `INVALID_ARGUMENT`;
   - a tentativa de usar o caminho alternativo sem `project_id` foi bloqueada pela politica de risco, para nao consultar o projeto errado.

## Arquivos

### Criados

- `servicos/hub/src/app/catalog-redirect.tsx`
- `servicos/hub/src/app/catalog-redirect-target.ts`
- `.Agent/REGISTROS/2026-07-29-1323-codex-correcao-caminhos-hub-e-catalogo.md`

### Modificados

- `servicos/hub/vite.config.ts`
- `index.html`
- `servicos/servicos.html`
- `servicos/hub/src/App.tsx`
- `servicos/hub/src/app/institutional-integration.test.tsx`
- `servicos/ferramentas/qr-code/index.html`

## Validacoes

| Comando ou teste | Resultado |
| --- | --- |
| `git status -sb` | `main`; arquivos do escopo modificados e `servicos/hub-app/` gerado pelo build |
| `npm.cmd run build` | aprovado; bundle gerado em `../hub-app` |
| `npm.cmd run test` | `64` arquivos; `62` aprovados, `2` falharam; `487` testes aprovados, `8` falhas conhecidas, `3` pulados |
| `npm.cmd run lint` | aprovado |
| `http://127.0.0.1:8080/` | `200`; HTML contem link para `servicos/hub-app/#/portais` |
| `http://127.0.0.1:8080/servicos/hub-app/` | `200`; bundle novo acessivel |
| `http://127.0.0.1:8080/servicos/ferramentas/qr-code/` | `200`; pagina legado agora redireciona para `../../hub-app/` |
| `Supabase list_projects` | visibilidade incorreta na sessao atual: apenas `lxaframzkwmhjiamipsv` e `crdtguvjuyfszxbpnwms` |
| `Supabase execute_sql` com `project_id = nnckpyzjllqsdcwlnxei` | `INVALID_ARGUMENT`; consulta do item 7 nao pode ser confirmada nesta sessao |

## Ajustes fora do escopo

- Nenhum ajuste funcional fora do escopo aprovado.

## Pendencias e riscos

- A consulta do item 7 ficou bloqueada por acesso/conector:
  - esta sessao nao enxerga o projeto `nnckpyzjllqsdcwlnxei`;
  - portanto nao foi possivel afirmar, nesta rodada, se `reinaldogramachof@gmail.com` existe ou nao em `auth.users` desse projeto.
- O build continua emitindo warnings ja conhecidos de chunk grande e `INEFFECTIVE_DYNAMIC_IMPORT`, sem impedir a geracao do bundle.
- As `8` falhas restantes continuam restritas a `mei-das-guide`, fora do escopo desta tarefa.
- O diretorio `servicos/hub-app/` ficou gerado localmente pelo build e ainda nao foi revisado/aprovado para commit.

## Estado final

- Status: Implementacao local concluida e pronta para revisao
- Commit: nao realizado
- Push: nao realizado
- Aprovacao local: pendente
