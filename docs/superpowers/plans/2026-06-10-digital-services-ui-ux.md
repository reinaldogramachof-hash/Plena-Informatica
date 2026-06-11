# Digital Services UI/UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Padronizar os cards e as paginas das 11 ferramentas digitais com a direcao B orientada por beneficios e a extensao C para servicos profissionais relacionados.

**Architecture:** Um catalogo de apresentacao tipado complementa os manifestos tecnicos sem misturar precos com logica de ferramenta. Componentes React compartilhados controlam cards, cabecalhos e blocos comerciais; a vitrine institucional recebe a mesma anatomia e filtros progressivos em JavaScript local.

**Tech Stack:** React 19, TypeScript, React Router, CSS, HTML semantico, JavaScript local, Vitest e Testing Library.

---

### Task 1: Contrato de apresentacao e catalogo comercial

**Files:**
- Create: `servicos/hub/src/app/tool-presentation.ts`
- Create: `servicos/hub/src/app/tool-presentation.test.ts`
- Modify: `servicos/hub/src/app/tool-registry.test.ts`

- [ ] Escrever testes para os 11 slugs, beneficios, CTA, privacidade e referencias comerciais.
- [ ] Executar os testes e confirmar a falha por ausencia do catalogo.
- [ ] Criar tipos `ToolPresentation` e `ProfessionalService`.
- [ ] Cadastrar metadados de todas as ferramentas, mantendo precos apenas nos servicos autorizados.
- [ ] Corrigir o teste legado que ainda espera seis ferramentas.
- [ ] Executar os testes focados e confirmar aprovacao.

### Task 2: Componentes compartilhados de pagina

**Files:**
- Create: `servicos/hub/src/app/ToolPageLayout.tsx`
- Create: `servicos/hub/src/app/ToolPageLayout.test.tsx`
- Modify: `servicos/hub/src/App.tsx`
- Modify: `servicos/hub/src/styles/app.css`

- [ ] Escrever testes para cabecalho, privacidade, status e CTA profissional opcional.
- [ ] Executar o teste e confirmar a falha inicial.
- [ ] Implementar `ToolPageLayout`, `ToolPageHeader` e `ProfessionalServiceLink`.
- [ ] Substituir as 11 funcoes de pagina repetidas por um mapa de componentes e uma rota generica.
- [ ] Garantir que ferramentas `building` continuem acessiveis apenas como pre-visualizacao interna, sem liberacao na vitrine.
- [ ] Executar testes de pagina e integracao.

### Task 3: Catalogo React padronizado

**Files:**
- Create: `servicos/hub/src/app/ToolCard.tsx`
- Create: `servicos/hub/src/app/ToolCard.test.tsx`
- Modify: `servicos/hub/src/App.tsx`
- Modify: `servicos/hub/src/styles/app.css`

- [ ] Escrever testes dos estados `available` e `building`.
- [ ] Implementar beneficios, metadados, CTA principal e CTA profissional secundario.
- [ ] Aplicar o componente ao caminho `#/catalogo`.
- [ ] Validar alvos de toque, foco, contraste e empilhamento mobile.

### Task 4: Vitrine institucional

**Files:**
- Modify: `servicos/servicos.html`
- Modify: `servicos/style.css`
- Modify: `servicos/hub/src/app/institutional-integration.test.tsx`

- [ ] Adicionar testes de contrato para beneficios, processamento local, CTA comercial e estados indisponiveis.
- [ ] Reestruturar os 11 cards com a anatomia aprovada.
- [ ] Manter CTA de ferramenta como acao primaria.
- [ ] Adicionar servico profissional apenas nos cards relacionados.
- [ ] Implementar busca, categorias, contador e estado vazio com JavaScript local.
- [ ] Garantir que os cinco cards `building` usem botoes desabilitados.
- [ ] Ajustar CSS para 1440, 768, 375 e 320 px.

### Task 5: Validacao final

**Files:**
- Modify: `servicos/ROADMAP.md`

- [ ] Executar testes focados.
- [ ] Executar suite completa.
- [ ] Executar lint.
- [ ] Executar build.
- [ ] Auditar mojibake nos arquivos alterados.
- [ ] Executar `git diff --check`.
- [ ] Conferir visualmente vitrine e paginas internas em desktop e mobile.
- [ ] Registrar a padronizacao no ROADMAP sem marcar ferramentas `building` como disponiveis.
