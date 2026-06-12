# Prompt de Comando — Agente Gemini 3.1
**Projeto:** Hub de Serviços Digitais — Plena Informática  
**Data:** 12 de junho de 2026  
**Origem:** Auditoria funcional realizada em 12/06/2026

---

## Contexto do projeto

Você está trabalhando no **Hub de Serviços Digitais** da Plena Informática, uma aplicação **React + TypeScript** construída com **Vite**, localizada em `servicos/hub/`.

A stack completa é:
- React 18, TypeScript, Vite
- `pdf-lib` para geração de PDF no navegador
- `qrcode` para geração de QR Codes
- Zod para validação de schemas
- Vitest + Testing Library para testes
- Supabase **apenas** nas áreas administrativas (nunca nas ferramentas públicas)

**Princípios invioláveis:**
- Ferramentas públicas funcionam **100% sem backend** — nenhum dado sai do navegador
- Nunca instalar, remover ou atualizar dependências sem justificar e listar explicitamente
- Seguir a separação DDD: `domain/` contém lógica pura (sem imports React), `ui/` contém os componentes
- Nunca colocar chave secreta em código cliente
- Todo texto em português, com acentuação correta em UTF-8
- Após qualquer alteração no Hub, executar: `npm run test`, `npm run lint`, `npm run build`

**Estrutura de cada ferramenta:**
```
src/features/tools/<slug>/
  manifest.ts          ← metadados da ferramenta
  domain/              ← lógica pura, testável sem React
  ui/                  ← componentes React + CSS
```

---

## Tarefas a implementar

Implemente as melhorias abaixo **na ordem apresentada**, do item 1 ao 6. Para cada item, siga o padrão TDD: escreva ou atualize o teste antes de implementar.

---

### TAREFA 1 — Download PDF no Checklist MEI/IRPF

**Arquivo principal:** `src/features/tools/mei-irpf-checklist/`

**Problema:** A ferramenta tem um botão "Imprimir ou salvar em PDF" que chama `window.print()`. Isso depende do usuário saber usar o recurso de impressão do navegador. Não há geração de PDF própria.

**O que implementar:**

1. Criar `src/features/tools/mei-irpf-checklist/domain/create-checklist-pdf.ts`:
   - Recebe `groups: ChecklistGroup[]`, `session: ChecklistSession`, `audience: ChecklistAudience`
   - Usa `pdf-lib` para gerar um PDF A4 com:
     - Título: "Checklist MEI" ou "Checklist IRPF" conforme o público
     - Data de geração no cabeçalho
     - Para cada grupo: nome do grupo em negrito, seguido da lista de itens com checkbox visual (quadrado vazio ou marcado com ✓ dependendo de `session.checked`)
     - Rodapé com aviso: "Este checklist é apenas orientativo e não substitui orientação contábil, fiscal ou jurídica. Gerado por Plena Informática."
   - Retorna `Promise<Uint8Array>` — mesmo padrão de todas as outras ferramentas
   - Usar a função `triggerDownload` já existente no projeto (padrão: `Blob` + `URL.createObjectURL` + revogação imediata)

2. Criar `src/features/tools/mei-irpf-checklist/domain/create-checklist-pdf.test.ts`:
   - Testar que retorna `Uint8Array` com dados
   - Testar que funciona com grupos vazios sem lançar exceção
   - Mockar `pdf-lib` conforme padrão dos outros testes de PDF no projeto

3. Atualizar `src/features/tools/mei-irpf-checklist/ui/MeiIrpfChecklistTool.tsx`:
   - Substituir o botão "Imprimir ou salvar em PDF" por **dois botões**:
     - "Baixar PDF" → chama `createChecklistPdf` e dispara download com nome `plena-checklist-mei.pdf` ou `plena-checklist-irpf.pdf`
     - "Imprimir" → mantém `window.print()` como fallback
   - Adicionar estado `isDownloading` (boolean) para desabilitar o botão durante geração
   - Adicionar estado `downloadError` (string) para exibir erro em `role="alert"` se falhar

4. Adicionar confirmação antes de `handleReset`:
   - Usar `window.confirm('Tem certeza? Todo o progresso será apagado.')` antes de resetar
   - Se o usuário cancelar, não resetar

---

### TAREFA 2 — Prévia do PDF no Gerador de Cardápio

**Arquivo principal:** `src/features/tools/menu-builder/`

**Problema:** O usuário preenche o cardápio, clica em "Gerar cardápio em PDF", baixa o arquivo, abre o PDF, percebe problemas de formatação e precisa voltar para corrigir. Não há prévia visual antes do download.

**O que implementar:**

1. Atualizar `src/features/tools/menu-builder/ui/MenuBuilderTool.tsx`:
   - Adicionar estado `previewUrl: string | null` (URL de objeto para o Blob do PDF)
   - Adicionar estado `showPreview: boolean`
   - Mudar o fluxo do botão "Gerar cardápio em PDF":
     - **Primeira ação:** gera o PDF → cria `URL.createObjectURL(blob)` → armazena em `previewUrl` → define `showPreview = true`
     - Exibir um iframe ou tag `<embed>` com `src={previewUrl}` logo abaixo das ações (visível apenas quando `showPreview = true`)
     - Adicionar botão "Baixar PDF" separado, que só aparece quando `previewUrl` existe, e dispara o download usando o mesmo blob já gerado
     - Adicionar botão "Fechar prévia" que revoga a URL e limpa o estado
   - Revogar `previewUrl` no unmount do componente (`useEffect` com cleanup)
   - A prévia deve ter altura mínima de 500px e largura 100%, com borda e label "Prévia do PDF"

2. Adicionar campo de **telefone de contato** opcional ao formulário:
   - Novo campo `phone: string` em `MenuData` (em `menu-data.ts`)
   - Placeholder: "(12) 99999-0000"
   - Incluir o telefone no PDF gerado, abaixo do nome do estabelecimento, se preenchido
   - Atualizar `create-menu-pdf.ts` para renderizar o campo quando presente
   - Atualizar testes correspondentes

3. Adicionar **máscara de moeda visual** ao campo de preço dos itens:
   - Não instalar biblioteca de máscara — implementar com `onChange` simples:
     - Aceitar apenas dígitos no input interno
     - Formatar e exibir como `R$ X,XX` para o usuário
     - Armazenar o valor formatado como string no estado (sem alterar o tipo `MenuItemData.price`)
   - Placeholder do campo mudar para "R$ 0,00"

---

### TAREFA 3 — Hook de persistência localStorage

**Problema:** Três ferramentas têm `persistence: 'optional'` no manifest mas perdem todos os dados ao fechar o navegador:
- `resume-builder`
- `declaration-builder`  
- `mei-irpf-checklist`

**O que implementar:**

1. Criar `src/lib/use-local-storage.ts`:
```typescript
// Hook genérico de persistência em localStorage
// Assinatura esperada:
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void]
```
   - Ler o valor inicial do `localStorage` na montagem (com try/catch — `localStorage` pode estar bloqueado)
   - Salvar automaticamente no `localStorage` a cada atualização
   - Serializar/deserializar via `JSON.stringify` / `JSON.parse`
   - Se o parse falhar, usar `initialValue` e limpar a chave corrompida

2. Criar `src/lib/use-local-storage.test.ts`:
   - Testar leitura do valor inicial
   - Testar persistência após atualização
   - Testar fallback para `initialValue` quando `localStorage` está indisponível (mockar `localStorage` para lançar exceção)
   - Testar que não quebra com JSON corrompido

3. Aplicar o hook em `resume-builder`:
   - Chave: `'plena-hub-resume-v1'`
   - Persistir: `personal`, `experiences`, `education`, `skillsText`, `templateId`
   - Adicionar banner discreto no topo da ferramenta quando dados persistidos são detectados: "Encontramos um rascunho salvo. [Continuar rascunho] [Começar do zero]"
   - "Começar do zero" limpa o localStorage e reinicia o estado

4. Aplicar o hook em `declaration-builder`:
   - Chave: `'plena-hub-declaration-v1'`
   - Persistir: `templateId`, `values`, `quoteItems`
   - Mesmo banner de rascunho detectado

5. Aplicar o hook em `mei-irpf-checklist`:
   - Chave: `'plena-hub-checklist-v1'`
   - Persistir: `session` (audience, scenarioId, answers, checked)
   - Ao detectar sessão salva, restaurar diretamente na etapa correta (se estava no result, ir para result; se estava em questions, ir para questions)
   - O botão "Reiniciar" já existente deve também limpar o localStorage

**Regra de segurança:** Nunca persistir dados sensíveis. CPF, documentos e valores financeiros inseridos nas declarações são dados do usuário e **ele decide** se quer manter. O banner de rascunho deve incluir a frase: "Seus dados ficam somente neste navegador."

---

### TAREFA 4 — Geração de Pix a partir de chave (QR Code)

**Arquivo principal:** `src/features/tools/qr-code/`

**Problema:** O modo "Pix Copia e Cola" exige que o usuário já tenha o payload completo EMV gerado pelo banco. A maioria dos usuários quer apenas informar a chave Pix e receber o QR Code.

**O que implementar:**

1. Criar `src/features/tools/qr-code/domain/pix-payload.ts`:
   - Implementar gerador de payload EMV Pix estático (sem valor fixo — apenas identificação do recebedor)
   - Função: `buildPixStaticPayload(input: PixStaticInput): string`
   - Tipo `PixStaticInput`:
     ```typescript
     type PixKeyType = 'cpf' | 'cnpj' | 'phone' | 'email' | 'random'
     interface PixStaticInput {
       keyType: PixKeyType
       key: string          // a chave Pix bruta
       receiverName: string // max 25 chars (padrão EMV)
       city: string         // max 15 chars (padrão EMV)
       description?: string // max 72 chars (padrão EMV), opcional
     }
     ```
   - O payload deve seguir o padrão EMV Merchant Presented QR Code (BACEN) com CRC16/CCITT no final
   - Implementar o CRC16 internamente (não instalar biblioteca)
   - Validações via Zod: chave não pode ser vazia, nome não pode ser vazio, cidade não pode ser vazia
   - Erros devem lançar `Error` com mensagem em português

2. Criar `src/features/tools/qr-code/domain/pix-payload.test.ts`:
   - Testar que o payload gerado começa com `000201` (indicador de formato EMV)
   - Testar que o CRC16 tem 4 caracteres hexadecimais no final
   - Testar cada tipo de chave
   - Testar validações (chave vazia, nome vazio)
   - Testar truncamento automático de nome/cidade quando excedem o limite

3. Atualizar `src/features/tools/qr-code/domain/qr-payload.ts`:
   - Adicionar modo `'pix-key'` ao union `QrMode`
   - Adicionar schema Zod para `pix-key` com os campos de `PixStaticInput`
   - `buildQrPayload` para o modo `pix-key` chama `buildPixStaticPayload` e retorna o payload EMV

4. Atualizar `src/features/tools/qr-code/ui/QrCodeTool.tsx`:
   - Adicionar modo `'pix-key'` com label "Pix por Chave" à lista de modos (inserir antes de "Pix Copia e Cola")
   - Formulário do modo `pix-key`:
     - Select "Tipo de chave": CPF, CNPJ, Telefone, E-mail, Chave aleatória
     - Input "Chave Pix" (placeholder varia conforme tipo: "000.000.000-00" para CPF etc.)
     - Input "Nome do recebedor" (max 25 chars, com contador)
     - Input "Cidade" (max 15 chars, com contador)
     - Input "Descrição" opcional (max 72 chars, com contador)
   - Manter o modo "Pix Copia e Cola" existente intacto
   - Adicionar nota: "O QR Code gerado é estático (sem valor fixo). O pagador informa o valor ao escanear."

---

### TAREFA 5 — Transportador de cargas no Guia DAS MEI

**Arquivo principal:** `src/features/tools/mei-das-guide/domain/das-values.ts`

**Problema:** O arquivo tem um comentário explícito: *"MEI transportador autônomo de cargas tem INSS de 12% (R$ 194,52). Esta função cobre apenas os tipos de atividade presentes na UI."* O tipo existe no código mas não aparece na interface.

**O que implementar:**

1. Atualizar `src/features/tools/mei-das-guide/domain/das-values.ts`:
   - Adicionar `'freight'` ao tipo `ActivityType`:
     ```typescript
     export type ActivityType = 'commerce' | 'services' | 'both' | 'transport' | 'freight'
     ```
   - Adicionar constante `INSS_MEI_FREIGHT = 194.52` (12% × R$ 1.621,00)
   - Implementar o case `'freight'` na função `getDasInfo`:
     - INSS: R$ 194,52 — nota: "Previdência social — 12% do salário-mínimo (R$ 1.621,00) — transportador autônomo de cargas"
     - ISS: R$ 5,00 — nota: "Imposto municipal — atividade de serviços"
     - Total: R$ 199,52

2. Atualizar `src/features/tools/mei-das-guide/domain/das-values.test.ts`:
   - Adicionar testes para o tipo `'freight'`
   - Verificar INSS = 194,52, ISS = 5,00, total = 199,52

3. Atualizar `src/features/tools/mei-das-guide/ui/MeiDasGuideTool.tsx`:
   - Adicionar opção ao grid de atividades:
     ```
     { value: 'freight', label: 'Transporte autônomo de cargas' }
     ```
   - Adicionar nota explicativa abaixo do grid (apenas visível quando `freight` está selecionado):
     "Transportadores autônomos de cargas recolhem INSS à alíquota de 12% (não 5%). Confirme sua situação no Portal do Empreendedor."

---

### TAREFA 6 — Data de atualização dos preços na Calculadora de Impressão

**Arquivo principal:** `src/features/tools/print-cost-estimator/`

**Problema:** Os preços da Plena (`R$ 3,00` preto, `R$ 4,00` colorido) estão hardcoded sem qualquer indicação de quando foram conferidos. Se os preços mudarem, o usuário não tem como saber que está vendo valores desatualizados.

**O que implementar:**

1. Atualizar `src/features/tools/print-cost-estimator/domain/print-cost.ts`:
   - Adicionar constante:
     ```typescript
     export const PLENA_PRICES_UPDATED_AT = '2026-06-12'
     ```
   - Exportar junto com `PLENA_PRICE_BLACK` e `PLENA_PRICE_COLOR`

2. Atualizar `src/features/tools/print-cost-estimator/ui/PrintCostEstimatorTool.tsx`:
   - No card "Na Plena", adicionar linha abaixo dos preços por página:
     ```
     Preços conferidos em 12/06/2026
     ```
   - Formatar a data usando `PLENA_PRICES_UPDATED_AT` (não hardcodar na UI)
   - No PDF gerado (`create-print-cost-pdf.ts`), incluir a mesma informação no rodapé do documento

3. Adicionar nota de guia de campo no disclaimer já existente:
   - Trocar o texto atual por:
     "Cálculo baseado nos valores informados e nos preços da Plena conferidos em [data]. Não inclui energia elétrica, depreciação, acabamento, encadernação, papel especial nem entrega. Confirme os preços atuais diretamente na Plena antes de tomar decisões."

---

## Validação final obrigatória

Após implementar **todas** as tarefas, executar na ordem:

```powershell
cd servicos\hub
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Os três comandos devem passar sem erros. Se algum teste falhar, corrija antes de considerar a tarefa concluída.

**Não altere testes existentes para esconder regressões.** Se um teste falhar por causa de uma mudança legítima de comportamento, atualize o teste para refletir o novo comportamento correto e documente o motivo.

---

## Restrições absolutas

- **Não instalar nenhuma dependência nova** sem listar explicitamente e justificar por que a stack atual não resolve.
- **Não tocar no painel administrativo** (`src/admin/`) — está fora do escopo.
- **Não alterar `vite.config.ts`, `tsconfig.json` nem `package.json`** sem aprovação explícita.
- **Não usar Supabase, fetch, axios ou qualquer chamada de rede** nas ferramentas públicas.
- **Não remover** notas de privacidade, avisos editoriais nem disclaimers legais existentes.
- **Não alterar preços** além do campo `PLENA_PRICES_UPDATED_AT` — preços só mudam com documento-base aprovado.
- Preservar acentuação correta em UTF-8 em todos os textos.
