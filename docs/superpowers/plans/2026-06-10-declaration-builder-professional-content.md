# Declaration Builder Professional Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar os cinco modelos atuais em documentos particulares mais completos, profissionais e seguros, mantendo processamento local e sem sugerir autenticação pela Plena.

**Architecture:** O catálogo continuará definindo os campos por modelo, mas passará a incluir seções, tipos de controle e orientações de uso. `build-declaration.ts` será a fonte única do conteúdo exibido na prévia e enviado ao PDF. O renderizador PDF receberá o documento estruturado, criará páginas adicionais quando necessário e repetirá um rodapé orientativo discreto.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, pdf-lib, CSS.

---

### Task 1: Catálogo e validação dos novos campos

**Files:**
- Modify: `servicos/hub/src/features/tools/declaration-builder/domain/declaration-templates.ts`
- Modify: `servicos/hub/src/features/tools/declaration-builder/domain/declaration-templates.test.ts`
- Modify: `servicos/hub/src/features/tools/declaration-builder/domain/declaration-data.ts`
- Modify: `servicos/hub/src/features/tools/declaration-builder/domain/declaration-data.test.ts`

- [ ] **Step 1: Escrever testes que exijam os novos metadados e campos**

Cobrir `section`, controles `select`, opções, indicação e contraindicação, além
dos campos obrigatórios de período de renda, escopo da autorização e quitação
do recibo.

- [ ] **Step 2: Executar os testes e confirmar falha**

Run:
`npm.cmd run test -- --run src/features/tools/declaration-builder/domain/declaration-templates.test.ts src/features/tools/declaration-builder/domain/declaration-data.test.ts`

Expected: FAIL por ausência dos novos metadados e campos.

- [ ] **Step 3: Implementar o catálogo expandido**

Adicionar ao tipo de campo:

```ts
type DeclarationField = {
  id: string
  section: 'identification' | 'details' | 'finalization'
  type: 'text' | 'date' | 'time' | 'textarea' | 'select'
  options?: Array<{ value: string; label: string }>
  // propriedades existentes
}
```

Adicionar `notRecommendedFor` aos modelos e cadastrar os campos descritos na
especificação, mantendo os IDs usados pelo compositor.

- [ ] **Step 4: Executar testes focados**

Expected: PASS.

### Task 2: Composição profissional dos cinco documentos

**Files:**
- Modify: `servicos/hub/src/features/tools/declaration-builder/domain/build-declaration.ts`
- Modify: `servicos/hub/src/features/tools/declaration-builder/domain/build-declaration.test.ts`

- [ ] **Step 1: Escrever testes do conteúdo aprovado**

Exigir:

```ts
expect(document.paragraphs.join(' ')).toContain('natureza autodeclaratória')
expect(document.footerNote).toContain('não possui assinatura digital')
expect(receipt.paragraphs.join(' ')).toContain('quitação parcial')
expect(authorization.paragraphs.join(' ')).not.toContain('viagem')
```

Também testar que opcionais vazios não geram pontuação quebrada e que a data é
formatada por extenso.

- [ ] **Step 2: Executar e confirmar falha**

Run:
`npm.cmd run test -- --run src/features/tools/declaration-builder/domain/build-declaration.test.ts`

- [ ] **Step 3: Implementar o novo `DeclarationDocument`**

Usar:

```ts
type DeclarationDocument = {
  title: string
  paragraphs: string[]
  locationDate: string
  signatureName: string
  signatureLabel: string
  signatureDocument?: string
  footerNote: string
}
```

Criar helpers para identificação, finalidade, data por extenso e inclusão
condicional de frases. Produzir dois a quatro parágrafos específicos por
modelo.

- [ ] **Step 4: Executar testes focados**

Expected: PASS.

### Task 3: PDF profissional e multipágina

**Files:**
- Modify: `servicos/hub/src/features/tools/declaration-builder/domain/create-declaration-pdf.ts`
- Modify: `servicos/hub/src/features/tools/declaration-builder/domain/create-declaration-pdf.test.ts`

- [ ] **Step 1: Escrever teste multipágina**

Gerar um documento com parágrafos longos e verificar:

```ts
expect(pdf.getPageCount()).toBeGreaterThan(1)
```

Manter o teste de PDF válido e o contrato do renderizador injetável.

- [ ] **Step 2: Executar e confirmar falha**

Run:
`npm.cmd run test -- --run src/features/tools/declaration-builder/domain/create-declaration-pdf.test.ts`

- [ ] **Step 3: Implementar paginação**

Criar helpers `addPage`, `ensureSpace`, `drawWrappedParagraph`,
`drawSignature` e `drawFooter`. Usar margens constantes, título sóbrio, corpo
11pt, assinatura sem simulação e rodapé em todas as páginas.

- [ ] **Step 4: Executar testes focados**

Expected: PASS.

### Task 4: Formulário orientado e prévia fiel

**Files:**
- Modify: `servicos/hub/src/features/tools/declaration-builder/ui/DeclarationBuilderTool.tsx`
- Modify: `servicos/hub/src/features/tools/declaration-builder/ui/DeclarationBuilderTool.test.tsx`
- Modify: `servicos/hub/src/features/tools/declaration-builder/ui/declaration-builder.css`

- [ ] **Step 1: Escrever testes da nova experiência**

Cobrir:

```ts
expect(screen.getByText('Não indicado para')).toBeInTheDocument()
expect(screen.getByRole('group', { name: 'Identificação' })).toBeInTheDocument()
expect(screen.getByLabelText('Natureza da atividade')).toBeInTheDocument()
expect(screen.getByText(/não deve ser usado para viagens/i)).toBeInTheDocument()
```

Atualizar o teste de download para preencher todos os novos campos obrigatórios.

- [ ] **Step 2: Executar e confirmar falha**

Run:
`npm.cmd run test -- --run src/features/tools/declaration-builder/ui/DeclarationBuilderTool.test.tsx`

- [ ] **Step 3: Implementar seções e controles**

Agrupar campos em `fieldset`, renderizar `select`, marcar opcionais, mostrar
indicação/contraindicação e incluir o rodapé na prévia A4.

- [ ] **Step 4: Atualizar CSS**

Adicionar estilos para seções, avisos, selects e rodapé da prévia, preservando
responsividade.

- [ ] **Step 5: Executar testes focados**

Expected: PASS.

### Task 5: Codificação, regressão e bundle público

**Files:**
- Modify: todos os arquivos alterados nas tarefas anteriores.
- Generated: `servicos/ferramentas/qr-code/index.html`
- Generated: `servicos/ferramentas/qr-code/assets/*`

- [ ] **Step 1: Auditar mojibake no recurso**

Run:
`rg -n "Ã|Â|�|â€" servicos/hub/src/features/tools/declaration-builder`

Expected: nenhuma ocorrência.

- [ ] **Step 2: Executar suíte completa**

Run: `npm.cmd run test -- --run`

Expected: todos os testes aprovados.

- [ ] **Step 3: Executar lint e build**

Run: `npm.cmd run lint`

Run: `npm.cmd run build`

Expected: ambos com exit code 0.

- [ ] **Step 4: Validar localmente**

Abrir:
`http://127.0.0.1:8087/servicos/ferramentas/qr-code/#/ferramentas/declaration-builder`

Confirmar seleção dos cinco modelos, prévia, aviso de segurança e geração do
PDF de exemplo.
