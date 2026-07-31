# Registro de acao

## Identificacao

- Data: `2026-07-31`
- Horario e fuso: `11:58 America/Sao_Paulo`
- Agente: Codex
- Pacote ou tarefa: Alinhamento do Hub publico com a pagina de Servicos Digitais
- Branch: `main`

## Escopo

- Confirmar a definicao de que a pagina `servicos/servicos.html` e a entrada publica das ferramentas digitais.
- Manter `servicos/hub-app/` como bundle tecnico/runtime das ferramentas.
- Remover a rota publica de Propostas, que sera reembarcada no futuro painel admin.
- Alinhar status de manifestos, CTAs publicos e testes de integracao.

## Acoes realizadas

- Removida a rota `#/propostas` de `servicos/hub/src/App.tsx`.
- Mantido o codigo de Propostas no repositorio como base futura, sem exposicao publica pelo Hub atual.
- Atualizados os testes institucionais para validar a pagina de Servicos Digitais como entrada publica e aguardar corretamente componentes lazy.
- Liberados na vitrine publica os CTAs de `resume-builder` e `declaration-builder`, que ja estavam `available` no Hub.
- Mantidos `menu-builder`, `business-card-creator` e `label-generator` como indisponiveis na vitrine publica.
- Marcados `mei-das-guide` e `print-cost-estimator` como `available` para ficar coerente com os CTAs publicos ja existentes.
- Corrigida a regra do DAS MEI para `freight`, aplicando INSS de R$ 194,52 e ISS de R$ 5,00.
- Atualizada a fonte oficial do DAS MEI para a pagina da Receita Federal/Simples Nacional conferida em `2026-07-31`.
- Ajustado timeout do primeiro teste de geracao de etiquetas em PDF, que pode exceder 5s no primeiro carregamento local do `pdf-lib`.
- Regenerado o bundle publico em `servicos/hub-app/`.

## Validacoes executadas

```powershell
cd servicos\hub
npm.cmd run test -- src/app/institutional-integration.test.tsx src/features/tools/mei-das-guide src/features/tools/label-generator/domain/create-labels-pdf.test.ts src/app/ToolCard.test.tsx src/app/tool-registry.test.ts
npm.cmd run test
npm.cmd run lint
npm.cmd run build
git diff --check
```

## Resultados

- Testes focados: `7 passed (7)`, `91 passed (91)`.
- Suite completa: `53 passed (53)`, `452 passed (452)`.
- Lint: aprovado.
- Build: aprovado.
- `git diff --check`: aprovado, com aviso nao-bloqueante de normalizacao CRLF/LF em `servicos/servicos.html`.

## Pendencias e observacoes

- `_run_servers.bat` ja estava nao versionado e nao foi alterado.
- A validacao foi por testes, lint e build; nao houve validacao visual/browser nesta rodada.
- O ROADMAP ainda precisa de uma passada documental posterior para remover ou arquivar a narrativa antiga do painel admin/F9.
