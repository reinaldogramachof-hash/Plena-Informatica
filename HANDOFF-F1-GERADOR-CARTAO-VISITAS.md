# Handoff de tarefa

- Data: `2026-06-11`
- Agente: Claude (Cowork / claude-sonnet-4-6)
- Ferramenta ou área: `servicos/hub` — feature `business-card-creator`
- Pacote: **F1 — Gerador de Cartão de Visitas**
- Status final: ✅ Implementação completa — validação parcial (lint e typecheck ✅ no sandbox; test e build pendentes na máquina Windows do usuário)

---

## Objetivo entregue

Substituição do stub vazio por um gerador real de cartões de visitas com:
- **PDF** (90×50mm, 3 estilos) via `pdf-lib`
- **PNG** (1063×591px, 3 estilos) via Canvas API com injeção de dependência
- Ambos integrados à UI com botões de download funcionais e tratamento de erro

---

## Arquivos criados

- `src/features/tools/business-card-creator/domain/business-card-data.ts` — tipos compartilhados `CardData` e `CardStyle` (ajuste fora do escopo, veja seção específica)
- `src/features/tools/business-card-creator/domain/create-business-card-pdf.ts` — gerador de PDF
- `src/features/tools/business-card-creator/domain/create-business-card-pdf.test.ts` — 6 testes do gerador PDF
- `src/features/tools/business-card-creator/domain/create-business-card-png.ts` — gerador de PNG com DI via `CanvasFactory`
- `src/features/tools/business-card-creator/domain/create-business-card-png.test.ts` — 7 testes do gerador PNG

---

## Arquivos modificados

- `src/features/tools/business-card-creator/ui/BusinessCardCreatorTool.tsx` — adicionado botão "Baixar como PNG", props injetáveis `generatePdf`/`generatePng`, `triggerDownload`, estado `processing`, tratamento de erro com `role="alert"`
- `src/features/tools/business-card-creator/ui/BusinessCardCreatorTool.test.tsx` — adicionados testes de download PDF e PNG (habilita botão, chama gerador, aciona `createObjectURL`/`revokeObjectURL`, exibe erro acessível)

---

## Lógica implementada

**PDF (`create-business-card-pdf.ts`):**
- Dimensões: 255.12 × 141.73pt (90×50mm a 72 dpi)
- 3 temas: `classic` (fundo branco + borda), `modern` (azul escuro), `colorful` (âmbar)
- Layout top-down: empresa → nome → cargo → linha separadora → contatos
- Normalização de acentos para compatibilidade com Helvetica WinAnsiEncoding
- Truncagem com `...` quando texto ultrapassa largura disponível

**PNG (`create-business-card-png.ts`):**
- Dimensões: 1063×591px (90×50mm a 300 DPI)
- Mesma paleta e layout do PDF, adaptada para Canvas 2D
- `CanvasFactory` injetável para testabilidade em jsdom (sem native canvas)
- `wrapText` para nome longo (até 2 linhas) e `truncateLine` para demais campos

**UI (`BusinessCardCreatorTool.tsx`):**
- Dois botões primários: "Baixar como PDF" e "Baixar como PNG"
- Desabilitados enquanto `fullName` está vazio ou há download em andamento
- Download via `Blob + URL.createObjectURL + anchor.click + revokeObjectURL`
- Mensagem de erro exibida com `role="alert"` para acessibilidade

---

## Testes adicionados

| Arquivo | Testes |
|---|---|
| `create-business-card-pdf.test.ts` | 6 — Uint8Array não vazio, 1 página, dimensões corretas, dados mínimos, 3 estilos válidos, 3 estilos distintos |
| `create-business-card-png.test.ts` | 7 — bytes corretos, canvas 1063×591, dados mínimos, fillRect chamado, 3 estilos, erro getContext null, erro toBlob null |
| `BusinessCardCreatorTool.test.tsx` | +8 — habilita botão após nome, chama gerador com args certos, aciona URL methods, exibe erro (×2 para PDF e PNG) |

---

## Validações executadas

| Validação | Resultado |
|---|---|
| TypeScript (`tsc --noEmit`) | ✅ 0 erros |
| Lint dos arquivos F1 (`eslint src/features/tools/business-card-creator/`) | ✅ 0 erros |
| Lint global (`eslint src/`) | ⚠️ 2 erros pré-existentes em `TransactionListPage.tsx` (fora do escopo F1) |
| Testes focados | ⚠️ Não executável no sandbox Linux (incompatibilidade CPU com Rolldown) |
| Suíte completa | ⚠️ Pendente na máquina Windows |
| Build (`vite build`) | ⚠️ Pendente na máquina Windows |
| Validação visual | ⚠️ Pendente na máquina Windows |

---

## Teste local (máquina Windows)

Execute dentro de `servicos/hub/`:

```
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Para testar visualmente, acesse o Hub, preencha o formulário e clique em "Baixar como PDF" e "Baixar como PNG".

---

## Ajustes fora do escopo

- **Criação de `domain/business-card-data.ts`**: o ROADMAP listava `CardData` e `CardStyle` como exportações de `BusinessCardCreatorTool.tsx`. Para evitar dependência circular (UI importa domain, domain importaria UI para os tipos), os tipos foram extraídos para um arquivo separado. O arquivo de UI re-exporta os tipos (`export type { CardData, CardStyle }`) mantendo compatibilidade com importadores externos.

---

## Pendências ou riscos

1. **Erros pré-existentes no lint global** — `TransactionListPage.tsx` tem 2 erros (`no-before-define` e `no-useless-catch`) que existiam antes do F1. Precisam ser corrigidos em pacote próprio antes de um pipeline de CI limpo.
2. **`manifest.ts` permanece `'building'`** — conforme regras do agente, a marcação como `'available'` é responsabilidade do proprietário do projeto.
3. **Arquivo temporário `create-business-card-png.test_stripped.ts`** — foi criado acidentalmente durante diagnóstico de lint e não pode ser removido do sandbox (permissão negada). Deve ser deletado manualmente ou via Windows Explorer.
4. **Testes e build não verificados no sandbox** — incompatibilidade de binário nativo Rolldown impede execução do Vitest no Linux. Todos os testes foram escritos e o typecheck passa; a execução real deve ser feita no Windows.

---

## Evidências Git

- Branch: `wip-jules-2026-06-10T13-43-47-928Z`
- Commit: sem commit (arquivos em working tree — `git add` e `git commit` são responsabilidade do proprietário)
- Push: pendente
