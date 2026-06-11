# Prompt — Agente Antigravity
# Tarefa: Criar as bases visuais das novas ferramentas do Hub Plena

---

## Contexto do projeto

**Repositório:** `C:\Users\reina\OneDrive\Desktop\Projetos\Site Institucional Plena`

**Stack:**
- React + TypeScript + Vite — pasta `servicos/hub/`
- Vitest + @testing-library/react — testes com `fireEvent` (nunca `userEvent`)
- pdf-lib já instalada — não instalar nada novo
- HashRouter (react-router-dom) — roteamento interno
- Nenhum backend, nenhum Supabase, tudo local no navegador

**Build output:** `servicos/ferramentas/qr-code/` (único ponto de entrada Vite)

---

## O que fazer

Criar a **estrutura base** de 5 novas ferramentas no Hub. A base inclui:

1. `manifest.ts` — registro tipado
2. `ui/{Component}Tool.tsx` — componente React com layout visual completo, estados de loading/erro e banner de privacidade
3. `ui/{slug}.css` — estilos completos com prefixo de namespace
4. `ui/{Component}Tool.test.tsx` — testes mínimos de renderização e estrutura visual

**NÃO implementar** a lógica de negócio (geração de PDF, cálculos, filtros de domínio). Isso será adicionado pelo Codex em seguida. A base deve ter:

- Layout fiel ao padrão visual do Hub
- Estados visuais completos: vazio, preenchendo, pronto, processando, erro
- Todos os campos e controles da interface, sem comportamento real ainda (handlers podem ser stubs `() => {}`)
- Testes verificando que os elementos obrigatórios estão presentes no DOM

---

## Arquivos que NÃO podem ser tocados

```
servicos/hub/src/App.tsx
servicos/hub/src/app/tool-registry.ts
servicos/hub/src/app/institutional-integration.test.tsx
servicos/servicos.html
servicos/ROADMAP.md
qualquer pasta de ferramenta já existente (qr-code, images-to-pdf, merge-pdf,
  resume-builder, declaration-builder, mei-irpf-checklist)
```

Não reverter, formatar nem sobrescrever arquivos existentes.

---

## Padrão visual obrigatório

Todas as ferramentas seguem este padrão. Leia os arquivos abaixo antes de criar qualquer coisa:

```
servicos/hub/src/features/tools/images-to-pdf/ui/ImagesToPdfTool.tsx
servicos/hub/src/features/tools/images-to-pdf/ui/images-to-pdf.css
servicos/hub/src/features/tools/mei-irpf-checklist/ui/MeiIrpfChecklistTool.tsx
servicos/hub/src/features/tools/mei-irpf-checklist/ui/mei-irpf-checklist.css
servicos/hub/src/features/tools/resume-builder/ui/ResumeBuilderTool.tsx
```

**Elementos obrigatórios em TODA ferramenta:**

```tsx
// 1. Banner de privacidade — sempre presente, sempre visível
<p className="{prefix}-privacy-notice">
  Processamento 100% local — nenhum arquivo ou dado sai do seu dispositivo.
</p>

// 2. Heading principal com o nome da ferramenta
<h2>{nome da ferramenta}</h2>

// 3. Seção de erro acessível
{error && <p role="alert" className="{prefix}-error">{error}</p>}

// 4. Botão de ação principal desabilitado quando não há dados ou durante processamento
<button
  type="button"
  disabled={!hasData || isProcessing}
  onClick={handleAction}
>
  {isProcessing ? 'Processando...' : 'Rótulo da ação'}
</button>
```

**CSS — regras obrigatórias:**

```css
/* Prefixo de namespace isolado por ferramenta (ex: .bc- para business-card) */
/* Nunca alterar app.css nem estilos de outra ferramenta */

/* Variável de acento — cada ferramenta tem a sua */
.{prefix}-tool {
  --{prefix}-accent: #HEX;
  max-width: 720px;      /* ou 800px dependendo do conteúdo */
  margin: 0 auto;
  padding: 1.5rem 1rem;
  font-family: inherit;
}

/* Impressão — ocultar controles, mostrar resultado */
@media print {
  .{prefix}-controls,
  .{prefix}-actions { display: none; }
  .{prefix}-result  { display: block; }
}

/* Responsividade mínima */
@media (max-width: 480px) {
  .{prefix}-tool { padding: 1rem 0.75rem; }
}

/* Acessibilidade de movimento */
@media (prefers-reduced-motion: reduce) {
  .{prefix}-tool * { transition: none !important; animation: none !important; }
}
```

**Inline styles são proibidos** — o linter ESLint bloqueia. Todo estilo vai no CSS.

---

## Ferramentas a criar

---

### Ferramenta 1 — Gerador de Cardápio

```
Slug:           menu-builder
Nome:           Gerador de Cardápio
Categoria:      documents
Processing:     local
RoadmapOrder:   7
Status:         building
Prefixo CSS:    .mb-
Acento:         #b45309   (âmbar escuro — remete a restaurante/alimento)
```

**Estrutura de pastas:**
```
servicos/hub/src/features/tools/menu-builder/
├── manifest.ts
└── ui/
    ├── MenuBuilderTool.tsx
    ├── MenuBuilderTool.test.tsx
    └── menu-builder.css
```

**Layout da interface (em ordem visual de cima para baixo):**

1. `<h2>Gerador de Cardápio</h2>` + subtítulo: _"Crie o layout do seu cardápio e baixe em PDF para impressão."_
2. Banner de privacidade
3. **Seção: Dados do estabelecimento**
   - Input: Nome do estabelecimento `*` (`aria-label="Nome do estabelecimento *"`)
   - Input: Slogan ou frase opcional (`aria-label="Slogan ou frase de destaque"`)
4. **Seção: Categorias e itens**
   - Botão "Adicionar categoria" — ao clicar, adiciona um grupo com:
     - Input: Nome da categoria (ex: Entradas, Pratos, Bebidas)
     - Botão "Adicionar item" — ao clicar, adiciona linha com:
       - Input: Nome do item
       - Input: Descrição breve (opcional)
       - Input: Preço (opcional, texto livre)
       - Botão "Remover item"
     - Botão "Remover categoria"
5. **Seção: Formato**
   - Radio: Tamanho — A4 / Meio sulfite
   - Radio: Colunas — 1 coluna / 2 colunas
6. Banner de aviso leve: _"Para impressão e plastificação profissional, leve o arquivo à Plena."_
7. Botão primário: "Gerar cardápio em PDF" — desabilitado sem nome do estabelecimento ou sem categorias
8. `{error && <p role="alert">...}` abaixo do botão

**Estado vazio:** _"Adicione pelo menos uma categoria para gerar o cardápio."_ com ícone SVG simples de cardápio (inline, aria-hidden).

**Props do componente:**
```tsx
interface MenuBuilderToolProps {
  generatePdf?: (data: MenuData, options: MenuOptions) => Promise<Uint8Array>
}
// Stub padrão: async () => new Uint8Array()
```

**Testes mínimos (MenuBuilderTool.test.tsx):**
- Renderiza heading "Gerador de Cardápio"
- Exibe banner de privacidade
- Botão "Gerar cardápio em PDF" presente e desabilitado inicialmente
- Clicar em "Adicionar categoria" exibe input de nome de categoria
- Campo "Nome do estabelecimento *" presente no DOM
- Exibe aviso sobre impressão na Plena

---

### Ferramenta 2 — Gerador de Cartão de Visitas

```
Slug:           business-card-creator
Nome:           Gerador de Cartão de Visitas
Categoria:      documents
Processing:     local
RoadmapOrder:   8
Status:         building
Prefixo CSS:    .bcc-
Acento:         #1e3a5f   (azul profissional — mesmo do template Executivo)
```

**Estrutura de pastas:**
```
servicos/hub/src/features/tools/business-card-creator/
├── manifest.ts
└── ui/
    ├── BusinessCardCreatorTool.tsx
    ├── BusinessCardCreatorTool.test.tsx
    └── business-card-creator.css
```

**Layout da interface:**

1. `<h2>Gerador de Cartão de Visitas</h2>` + subtítulo: _"Crie o layout digital e leve para impressão na Plena."_
2. Banner de privacidade
3. **Seção esquerda / principal: Dados do cartão**
   - Input: Nome completo `*`
   - Input: Cargo / profissão
   - Input: Telefone / WhatsApp
   - Input: E-mail
   - Input: Site ou Instagram
   - Input: Cidade / Estado
   - Input: Nome da empresa (opcional)
4. **Seção: Estilo**
   - Radio de layout: Clássico / Moderno / Colorido
     - Clássico: fundo branco, texto escuro
     - Moderno: fundo azul escuro (#1e3a5f), texto branco
     - Colorido: fundo âmbar (#b45309), texto branco
   - Nota: _"A Plena imprime 100 cartões por R$ 50,00."_
5. **Prévia do cartão** (div `.bcc-card-preview`) — exibe os dados digitados em tempo real no estilo selecionado. Dimensões proporcionais a 9cm × 5cm (relação 9:5). Sem imagem real — apenas layout CSS.
6. Botão primário: "Baixar como PDF" — desabilitado sem nome
7. Botão secundário: "Imprimir prévia" — chama `window.print()`
8. `{error && <p role="alert">...}`

**Prévia CSS (`.bcc-card-preview`):**
- `aspect-ratio: 9 / 5`
- `max-width: 360px`
- `border-radius: 8px`
- Três variantes: `.bcc-card-preview--classic`, `.bcc-card-preview--modern`, `.bcc-card-preview--colorful`

**Props:**
```tsx
interface BusinessCardCreatorToolProps {
  generatePdf?: (data: CardData, style: CardStyle) => Promise<Uint8Array>
}
```

**Testes mínimos:**
- Renderiza heading "Gerador de Cartão de Visitas"
- Banner de privacidade presente
- Botão "Baixar como PDF" desabilitado sem nome
- Prévia do cartão presente no DOM (`.bcc-card-preview`)
- Preencher nome exibe o nome na prévia
- Três opções de estilo disponíveis (radio Clássico / Moderno / Colorido)
- Botão "Imprimir prévia" presente

---

### Ferramenta 3 — Gerador de Etiquetas

```
Slug:           label-generator
Nome:           Gerador de Etiquetas
Categoria:      documents
Processing:     local
RoadmapOrder:   9
Status:         building
Prefixo CSS:    .lg-
Acento:         #0f4c81   (azul corporativo — mesmo do template Moderno)
```

**Estrutura de pastas:**
```
servicos/hub/src/features/tools/label-generator/
├── manifest.ts
└── ui/
    ├── LabelGeneratorTool.tsx
    ├── LabelGeneratorTool.test.tsx
    └── label-generator.css
```

**Layout da interface:**

1. `<h2>Gerador de Etiquetas</h2>` + subtítulo: _"Crie etiquetas para impressão em folha A4 padrão."_
2. Banner de privacidade
3. **Seção: Formato da folha**
   - Select: Layout da folha
     - `2x6` — 12 etiquetas por página (padrão Pimaco 6182)
     - `3x9` — 27 etiquetas por página (padrão Pimaco 6080)
     - `4x13` — 52 etiquetas por página (padrão Pimaco 6080 mini)
   - Checkbox: Borda nas etiquetas
4. **Seção: Conteúdo das etiquetas**
   - Textarea grande: uma etiqueta por linha (`aria-label="Conteúdo das etiquetas, uma por linha"`)
   - Contador ao vivo: "X etiquetas" (conta linhas não vazias)
   - Aviso quando quantidade excede o layout selecionado: usa `role="alert"`
5. **Prévia** (div `.lg-preview`) — grade de retângulos CSS representando as etiquetas com o texto ao vivo. Usa `overflow: hidden` e `text-overflow: ellipsis` em cada célula.
6. Botão: "Gerar PDF de etiquetas" — desabilitado sem conteúdo
7. Nota: _"Para impressão em papel etiqueta, leve o arquivo à Plena (a partir de R$ 3,50)."_
8. `{error && <p role="alert">...}`

**Props:**
```tsx
interface LabelGeneratorToolProps {
  generatePdf?: (labels: string[], layout: LabelLayout) => Promise<Uint8Array>
}
```

**Testes mínimos:**
- Renderiza heading "Gerador de Etiquetas"
- Banner de privacidade presente
- Textarea de conteúdo presente
- Botão desabilitado sem conteúdo
- Digitar texto na textarea conta as etiquetas corretamente
- Select de layout presente com as 3 opções
- Prévia `.lg-preview` presente no DOM

---

### Ferramenta 4 — Guia DAS MEI

```
Slug:           mei-das-guide
Nome:           Guia DAS MEI
Categoria:      business
Processing:     local
RoadmapOrder:   10
Status:         building
Prefixo CSS:    .mdg-
Acento:         #2d6a4f   (verde — mesmo do template Primeiro Emprego)
```

**Estrutura de pastas:**
```
servicos/hub/src/features/tools/mei-das-guide/
├── manifest.ts
└── ui/
    ├── MeiDasGuideTool.tsx
    ├── MeiDasGuideTool.test.tsx
    └── mei-das-guide.css
```

**Layout da interface:**

1. `<h2>Guia DAS MEI</h2>` + subtítulo: _"Entenda os valores mensais do DAS e organize suas guias."_
2. **Aviso editorial obrigatório** (estilo destaque, não banner de privacidade):
   ```
   Este guia é apenas orientativo. Os valores do DAS são reajustados anualmente
   pela Receita Federal. Confirme os valores vigentes no Portal do Empreendedor
   (gov.br/empresas-e-negocios/mei) antes de efetuar qualquer pagamento.
   ```
3. **Seção: Tipo de atividade**
   - Radio group com `<fieldset>` + `<legend>Qual é a sua atividade principal?</legend>`
     - Comércio
     - Serviços
     - Comércio e Serviços
     - Transporte de passageiros
   - Checkbox: "Tenho empregado registrado"
4. **Resultado — tabela de componentes do DAS** (aparece após seleção):
   - Coluna: Componente (INSS, ICMS, ISS)
   - Coluna: Valor fixo
   - Coluna: Observação
   - Linha de Total
   - Nota abaixo da tabela: _"Valores ilustrativos. Consulte gov.br para valores vigentes."_
5. **Seção: Organização das guias**
   - Informação orientativa sobre o que é o DAS, quando pagar, como acessar o PGMEI
   - Link externo para o Portal do Empreendedor (exibir URL, não clicar diretamente — o Codex cuidará dos links)
6. **Seção: Situação das guias** (checklist simples, sem persistência)
   - Checkboxes: "Janeiro", "Fevereiro", ..., "Dezembro" — o usuário marca os meses pagos
   - Contador: "X de 12 meses marcados"
   - Botão: "Imprimir organização" → `window.print()`
7. Aviso de privacidade: _"Suas marcações ficam somente neste navegador e são apagadas ao fechar a aba."_

**NÃO incluir** valores reais de DAS — deixar as células com `'—'` ou `'{valor}'`. O Codex vai preencher com os dados corretos após verificar as fontes oficiais.

**Props:**
```tsx
// Sem props externas — ferramenta puramente visual nesta fase
export function MeiDasGuideTool() { ... }
```

**Testes mínimos:**
- Renderiza heading "Guia DAS MEI"
- Aviso editorial obrigatório presente no DOM
- Radio de atividade com as 4 opções (Comércio, Serviços, Comércio e Serviços, Transporte)
- Checkbox "Tenho empregado registrado" presente
- 12 checkboxes de meses presentes
- Botão "Imprimir organização" presente
- Aviso de privacidade sobre sessão local presente

---

### Ferramenta 5 — Calculadora de Impressão

```
Slug:           print-cost-estimator
Nome:           Calculadora de Impressão
Categoria:      utilities
Processing:     local
RoadmapOrder:   11
Status:         building
Prefixo CSS:    .pce-
Acento:         #7b2d8b   (roxo — mesmo do template Criativo)
```

**Estrutura de pastas:**
```
servicos/hub/src/features/tools/print-cost-estimator/
├── manifest.ts
└── ui/
    ├── PrintCostEstimatorTool.tsx
    ├── PrintCostEstimatorTool.test.tsx
    └── print-cost-estimator.css
```

**Layout da interface:**

1. `<h2>Calculadora de Impressão</h2>` + subtítulo: _"Compare o custo de imprimir em casa com o custo de terceirizar na Plena."_
2. Banner de privacidade
3. **Seção: Seu volume mensal**
   - Input number: Páginas em preto por mês (`min="0"`, `aria-label="Páginas em preto por mês"`)
   - Input number: Páginas coloridas por mês
4. **Seção: Custo estimado da sua impressora** (acordeon ou seção expansível)
   - Input number: Custo do cartucho/toner (R$)
   - Input number: Rendimento do cartucho (páginas)
   - Input number: Papel por resma (R$)
   - Input number: Folhas por resma
   - Input number: Manutenção mensal estimada (R$)
   - Nota: _"Preencha com os valores reais do seu equipamento para uma comparação precisa."_
5. **Resultado** (div `.pce-result`) — exibe comparação lado a lado:
   - Cartão "Impressora própria": custo por página + custo total mensal
   - Cartão "Na Plena": custo por página fixo + custo total mensal
   - Destaque: diferença entre os dois cenários (sem juízo de valor — apenas o número)
   - Nota: _"Cálculo baseado nos valores informados. Não inclui custo de energia elétrica nem depreciação do equipamento."_
6. Botão: "Imprimir comparativo" → `window.print()`
7. `{error && <p role="alert">...}`

**Aviso editorial obrigatório** (pequeno, abaixo do resultado):
_"Esta calculadora é apenas orientativa e não representa proposta comercial."_

**Props:**
```tsx
// Sem props externas — cálculo será implementado pelo Codex
export function PrintCostEstimatorTool() { ... }
```

**Testes mínimos:**
- Renderiza heading "Calculadora de Impressão"
- Banner de privacidade presente
- Inputs de páginas em preto e colorido presentes
- Seção de resultado `.pce-result` presente no DOM
- Aviso editorial presente
- Botão "Imprimir comparativo" presente

---

## Regras de implementação (CRÍTICAS)

### Encoding e arquivos
- **Todos os arquivos em UTF-8** com acentuação PT-BR correta
- **NÃO usar PowerShell para criar ou reescrever arquivos** de código ou texto — isso corrompe acentos neste projeto
- Usar a ferramenta `Write` do agente para criar arquivos

### Código React
- Inline styles proibidos (`style={{ ... }}`) — linter ESLint bloqueia
- Imports de CSS: `import './{slug}.css'` no componente
- Sem `console.log` com dados do usuário
- Sem dependências novas — usar apenas o que já está em `package.json`

### CSS
- Cada ferramenta usa seu prefixo exclusivo — nunca usar classes de outra ferramenta
- Nunca alterar `src/styles/app.css`
- `@media print` obrigatório em todas as ferramentas
- `@media (prefers-reduced-motion: reduce)` obrigatório

### Testes
- Usar `fireEvent` do `@testing-library/react` — nunca `userEvent` (não instalado)
- Importar: `import { fireEvent, render, screen } from '@testing-library/react'`
- Importar: `import { describe, expect, it } from 'vitest'`
- Cada ferramenta precisa de pelo menos 5 testes

### Manifesto — contrato TypeScript obrigatório
```typescript
import type { ToolManifest } from '../types'

export const {camelSlug}Manifest: ToolManifest = {
  slug: '{slug}',
  name: '{Nome}',
  shortDescription: '{Descrição curta em PT-BR}',
  category: '{categoria}',       // 'documents' | 'pdf' | 'professional' | 'business' | 'utilities'
  processing: 'local',
  accountRequirement: 'none',
  persistence: 'none',
  status: 'building',            // NÃO marcar como 'available'
  roadmapOrder: {número},
}
```

---

## O que NÃO fazer

- NÃO implementar geração de PDF (sem `PDFDocument.create()`, sem `pdf-lib` nesta fase)
- NÃO calcular nada — os resultados podem mostrar `0` ou `—` por enquanto
- NÃO adicionar as ferramentas ao `tool-registry.ts`
- NÃO alterar `App.tsx`
- NÃO alterar `servicos.html`
- NÃO fazer commit nem push

---

## Verificação final obrigatória

Após criar todos os arquivos, executar:

```powershell
cd "C:\Users\reina\OneDrive\Desktop\Projetos\Site Institucional Plena\servicos\hub"
npm.cmd run test -- --run
npm.cmd run lint
npm.cmd run build
```

Todos devem passar sem erros. Avisos de chunk size e `INEFFECTIVE_DYNAMIC_IMPORT` são pré-existentes e esperados.

---

## Relatório final esperado

Ao concluir, informar:

1. Arquivos criados (lista completa)
2. Elementos visuais implementados por ferramenta
3. Quantidade de testes aprovados (total e por ferramenta)
4. Resultado de lint e build
5. Qualquer ajuste realizado fora deste escopo — se nenhum: escrever exatamente "Nenhum ajuste fora do escopo foi realizado."

Não fazer commit nem push.
