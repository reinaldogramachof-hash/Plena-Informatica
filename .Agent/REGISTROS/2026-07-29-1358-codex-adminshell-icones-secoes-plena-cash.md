# Registro de acao

## Identificacao

- Data: `2026-07-29`
- Horario e fuso: `13:58 America/Sao_Paulo`
- Agente: Codex
- Pacote ou tarefa: Aproximacao do `AdminShell` ao modelo real do zip Plena Cash Control
- Solicitacao de origem: Substituir icones de texto por Lucide reais, agrupar navegacao em secoes, esconder placeholders do menu digital e validar o shell administrativo
- Branch: `main`

## Escopo

- Objetivo:
  - adicionar `lucide-react` no Hub;
  - portar os icones reais do layout de referencia;
  - agrupar o menu em secoes com titulos;
  - deixar Gestao Digital exibindo apenas Propostas;
  - manter o baseline de validacao ja conhecido.
- Arquivos permitidos:
  - `servicos/hub/package.json`
  - `servicos/hub/package-lock.json`
  - `servicos/hub/src/admin/shell/AdminShell.tsx`
  - `servicos/hub/src/admin/shell/admin-shell.css`
  - `servicos/hub/src/admin/auth/AdminApp.test.tsx`
  - `.Agent/REGISTROS/2026-07-29-1358-codex-adminshell-icones-secoes-plena-cash.md`
- Arquivos reservados:
  - autenticacao, schema, RLS e telas futuras fora do shell
- Criterios de aceite:
  - `lucide-react` instalado;
  - menu lateral com icones reais e secoes agrupadas;
  - Gestao Digital sem links placeholder;
  - `build`, `test` e `lint` no baseline esperado.

## Estado inicial

- Git:
  - `main`
  - arquivos ja nao rastreados fora desta rodada: `.Agent/REGISTROS/2026-07-29-1340-codex-commit-push-correcao-caminhos-hub.md`, `graphify-out/`, `servicos/docs/DESIGN-REFERENCE-PLENA-CASH-CONTROL.md`
- Testes:
  - baseline esperado: falhas isoladas em `mei-das-guide`, restante aprovado
- Lint:
  - esperado limpo
- Build:
  - esperado limpo com regeneracao de `servicos/hub-app/`
- Riscos conhecidos:
  - a substituicao de letras por SVGs poderia quebrar testes que dependessem do texto visivel antigo

## Acoes realizadas

1. Confirmei o estado do repo e li `AdminShell.tsx`, `admin-shell.css`, `package.json` e o modelo local em `tmp-caixa/Plena-Controle-de-Caixa--main/components/Layout.tsx`.
2. Confirmei que o zip de referencia usa `lucide-react` com React 19 (`react@19.2.1` no modelo e `lucide-react@^0.556.0`).
3. Instalei `lucide-react@0.556.0` no Hub.
4. Reestruturei `AdminShell.tsx` para usar secoes de navegacao:
   - Gestao Escritorio:
     - `Principal`: Dashboard
     - `Operacional`: Transacoes, Clientes, Servicos, Fechamento
     - `Sistema`: Categorias, Importar JSON
   - Gestao Digital:
     - `Digital`: Propostas
5. Substitui os icones textuais pelos icones Lucide:
   - Dashboard -> `PieChart`
   - Transacoes -> `ArrowRightLeft`
   - Clientes -> `Users`
   - Servicos -> `Briefcase`
   - Fechamento -> `Lock`
   - Categorias -> `Tag`
   - Importar JSON -> `FileJson`
   - Propostas -> `FileText`
   - marca -> `Wallet`
   - menu mobile -> `Menu` / `X`
6. Removi do menu digital os placeholders `Clientes tecnologia`, `Projetos` e `Catalogo`.
7. Ajustei `admin-shell.css` para suportar as secoes, os SVGs e o botao mobile iconico sem alterar o comportamento desktop/mobile fora do escopo.
8. Ajustei `AdminApp.test.tsx` para validar estrutura por secoes, `data-testid` dos icones e o menu digital enxuto, sem depender das letras antigas.
9. Rodei `npm.cmd run build`, `npm.cmd run test` e `npm.cmd run lint`.

## Arquivos

### Criados

- `.Agent/REGISTROS/2026-07-29-1358-codex-adminshell-icones-secoes-plena-cash.md`

### Modificados

- `servicos/hub/package.json`
- `servicos/hub/package-lock.json`
- `servicos/hub/src/admin/shell/AdminShell.tsx`
- `servicos/hub/src/admin/shell/admin-shell.css`
- `servicos/hub/src/admin/auth/AdminApp.test.tsx`

## Validacoes

| Comando ou teste | Resultado |
| --- | --- |
| `npm.cmd run build` | aprovado; gerou novo bundle em `servicos/hub-app/` |
| `npm.cmd run test` | `64` arquivos; `62` aprovados, `2` falharam; `489` testes aprovados, `8` falhas conhecidas, `3` pulados |
| `npm.cmd run lint` | aprovado |

## Ajustes fora do escopo

- Nenhum ajuste funcional fora do shell administrativo.

## Pendencias e riscos

- `servicos/hub-app/` foi regenerado pelo build e ficou alterado no workspace por conta desta rodada; nao houve commit/push.
- Permanecem nao rastreados fora do escopo:
  - `.Agent/REGISTROS/2026-07-29-1340-codex-commit-push-correcao-caminhos-hub.md`
  - `graphify-out/`
  - `servicos/docs/DESIGN-REFERENCE-PLENA-CASH-CONTROL.md`
- As `8` falhas continuam restritas ao pacote `mei-das-guide`, fora desta tarefa.

## Estado final

- Status: implementacao local concluida e pronta para revisao
- Commit: nao realizado
- Push: nao realizado
- Aprovacao local: pendente
