# Registro de ação

## Identificação

- Data: `2026-07-13`
- Horário e fuso: `21:49 America/Sao_Paulo`
- Agente: Codex
- Pacote ou tarefa: auditoria do Hub e evolução sequencial das ferramentas não liberadas
- Solicitação de origem: pedido do responsável pelo projeto nesta conversa
- Branch: `main`

## Escopo

- Objetivo: confrontar a vitrine e o ROADMAP com o código atual, identificar quais ferramentas ainda estão bloqueadas de fato e evoluir o primeiro pacote funcional pendente na ordem oficial.
- Arquivos permitidos: leitura da área `servicos/`; alterações somente na pasta proprietária do pacote funcional selecionado e neste registro obrigatório.
- Arquivos reservados: `servicos/hub/src/App.tsx`, `servicos/hub/src/app/tool-registry.ts`, `servicos/hub/src/app/tool-presentation.ts`, `servicos/servicos.html`, `servicos/style.css`, `servicos/ROADMAP.md`, `servicos/hub/package.json` e `servicos/hub/package-lock.json`.
- Critérios de aceite: diagnóstico baseado no checkout atual; TDD no pacote escolhido; testes focados, suíte completa, lint, build, `git diff --check`, auditoria de acentuação e validação do resultado final.

## Estado inicial

- Git: branch `main` com alterações preexistentes em áreas institucionais, administrativas, currículo, arquivos centrais e build publicado; todas serão preservadas.
- Testes: baseline desta ação com 55 arquivos e 476 testes aprovados, além de 3 testes suspensos.
- Lint: baseline aprovado.
- Build: baseline aprovado com avisos de chunk e importação dinâmica ineficaz do `pdf-lib`.
- Riscos conhecidos: ROADMAP e auditoria histórica podem estar defasados em relação ao código; `App.tsx`, `servicos.html` e o build publicado já possuem mudanças alheias.

## Ações realizadas

1. Leitura da governança obrigatória, decisões, feedbacks, ROADMAP e auditoria histórica.
2. Levantamento inicial do Git e dos estados públicos das ferramentas.
3. Geração de grafo estrutural e semântico das 11 ferramentas: 332 nós, 433 relações e 17 comunidades úteis no relatório final.
4. Auditoria dos cinco pacotes com manifesto `building`; 14 arquivos e 213 testes focados aprovados.
5. Evolução do pacote F4 com bloqueio de PDF vazio, aviso acessível para entradas negativas, acentuação da interface e validação estrutural do PDF A4.
6. Validação no navegador em 1440, 768, 375 e 320 px, incluindo interação, cálculo e console.
7. Identificação de estouro horizontal em 320 px causado por `min-width: 320px` no estilo compartilhado, fora da pasta proprietária F4.

## Arquivos

### Criados

- `.Agent/REGISTROS/2026-07-13-2149-codex-auditoria-evolucao-ferramentas-digitais.md`.
- `servicos/hub/src/features/tools/print-cost-estimator/domain/create-print-cost-pdf.test.ts`.
- `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`, `graphify-out/graph.html` e metadados do Graphify.
- `servicos/ferramentas/qr-code/assets/index-m7phraEe.js`, gerado automaticamente pelo build obrigatório.

### Modificados

- `servicos/hub/src/features/tools/print-cost-estimator/domain/create-print-cost-pdf.ts`.
- `servicos/hub/src/features/tools/print-cost-estimator/ui/PrintCostEstimatorTool.tsx`.
- `servicos/hub/src/features/tools/print-cost-estimator/ui/PrintCostEstimatorTool.test.tsx`.
- `servicos/ferramentas/qr-code/index.html`, atualizado automaticamente pelo build obrigatório sobre mudança preexistente.

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `git status -sb` | branch `main` com alterações preexistentes preservadas |
| `npm.cmd run test -- src/features/tools/print-cost-estimator` | 3 arquivos e 36 testes aprovados |
| testes dos cinco pacotes `building` | 14 arquivos e 213 testes aprovados |
| `npm.cmd run test` | 56 arquivos aprovados; 480 testes aprovados e 3 suspensos |
| `npm.cmd run lint` | aprovado |
| `npm.cmd run build` | aprovado; bundle principal de 1.146,91 kB com aviso de tamanho |
| `git diff --check` | aprovado; apenas avisos preexistentes de normalização CRLF/LF |
| auditoria de mojibake no pacote F4 | nenhum padrão de mojibake encontrado |
| navegador 1440, 768 e 375 px | aprovado, sem overflow ou erros de console |
| navegador 320 px | cálculo e interação aprovados; reprovado por rolagem horizontal global |

## Ajustes fora do escopo

- O build obrigatório atualizou a saída publicada reservada e substituiu o bundle não rastreado `index-f5i61u4p.js` por `index-m7phraEe.js`. Esses arquivos não devem ser integrados antes da etapa I1.

## Pendências e riscos

- O ROADMAP está defasado: declaração e checklist estão `available`; os cinco pacotes bloqueados já possuem lógica real e testes focados.
- A vitrine pública já liga Guia DAS MEI e Calculadora de Impressão, embora ambos os manifestos permaneçam `building`; a integração está inconsistente.
- Corrigir o `min-width: 320px` de `servicos/hub/src/styles/app.css` exige autorização de expansão para arquivo compartilhado.
- O responsável ainda precisa executar o teste local da Calculadora de Impressão antes de qualquer mudança para `available`.

## Estado final

- Status: pacote F4 evoluído e validado tecnicamente, aguardando correção compartilhada de 320 px e aprovação local.
- Commit: não realizado.
- Push: não realizado.
- Aprovação local: pendente.
