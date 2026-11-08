# Registro de ação

## Identificação

- Data: `2026-11-08`
- Horário e fuso: `13:50 America/Sao_Paulo`
- Agente: Antigravity
- Pacote ou tarefa: Lapidação visual e correção de quebra de layout na Landing Page do Gestão Odonto Pro e padronização com o design system de produtos.
- Solicitação de origem: "precisa aplicar uma lapidação visual pois algumas telas o css quebrou." (acompanhada de screenshot da página `produtos/gestao-odonto.html`).
- Branch: `main`

## Escopo

- Objetivo:
  1. Corrigir a sobreposição visual na navbar e no hero do `produtos/gestao-odonto.html`:
     - O menu mobile estava usando a classe `.assistencia-mobile-menu` em vez da classe canônica `.product-mobile-menu`, fazendo com que ele não herdasse `display: none` no desktop e ficasse renderizado diretamente sobre a tela como lista não estilizada.
     - A barra de navegação continha elementos `<ul>` e `<li>` dentro de `.nav-links`, gerando marcadores de lista (*bullets*) indesejados.
     - Botões duplicados em `.nav-cta` estavam quebrando o layout do cabeçalho à direita.
     - O botão burger usava spans soltos em `.assistencia-burger` em vez do padrão `.nav-mobile-actions` com `.mobile-menu-toggle`.
  2. Alinhar a estrutura de classes de `produtos/gestao-odonto.html` ao padrão estrito de `produtos/assets/produtos.css`:
     - `.product-hero-copy`, `h1`, `p.lead`, `.actions` e `.assistencia-hero-note`.
     - `.grid.cols-3` e `.card` nos módulos e na seção de privacidade.
     - `.routine-flow`, `.routine-step` e `.step-number` na rotina de cadeira.
     - `.assistencia-pricing-grid` e `.assistencia-price-card.assistencia-price-card--featured` na área de licenciamento.
     - `.assistencia-faq` e `.assistencia-faq__list` com detalhes e sumários estilizados.
  3. Adicionar regras complementares de contraste e componentes escuros em `produtos/assets/produtos.css` para temas clínicos (`.odonto-product-page` e `.therapy-product-page`).
- Arquivos permitidos:
  - `produtos/gestao-odonto.html`
  - `produtos/assets/produtos.css`
  - `.Agent/REGISTROS/2026-11-08-1350-antigravity-lapidacao-visual-odonto.md`
- Critérios de aceite:
  - Menu mobile oculto no desktop (`display: none`), abrindo apenas via trigger mobile.
  - Navbar limpa, sem marcadores de lista (*bullets*), botões encavalados ou spans soltos.
  - Alinhamento de todos os blocos e cards ao grid do design system.
  - Textos de listas e FAQs com contraste adequado sobre fundo escuro.
  - `git diff --check` sem erros.

## Ações realizadas

1. **Diagnóstico da Causa Raiz**:
   - Analisou o screenshot enviado pelo usuário.
   - Identificou que o menu mobile estava com a classe `assistencia-mobile-menu`, enquanto o CSS global define a ocultação e painel sob `.product-mobile-menu`.
   - Identificou tags `<ul>` e `<li>` inseridas indevidamente em `.nav-links`.
   - Identificou botões extras em `.nav-cta` que sobrecarregavam o flex da navbar.

2. **Refatoração Estrutural de `produtos/gestao-odonto.html`**:
   - Substituiu o cabeçalho pela estrutura canônica: `.nav-links` contendo links `<a>` diretos e botão de WhatsApp, além de `.nav-mobile-actions` contendo `.mobile-header-whatsapp` e `.mobile-menu-toggle` com ícone Lucide.
   - Corrigiu o container do menu mobile para `class="product-mobile-menu"`, com `product-mobile-menu__backdrop` e `aside.product-mobile-menu__panel`.
   - Corrigiu a seção Hero para utilizar as classes `.product-hero-copy`, `.lead`, `.actions` e `.assistencia-hero-note`.
   - Converteu todos os blocos de recursos para `<div class="grid cols-3">` com `<article class="card">`.
   - Converteu a seção de rotina para `.routine-flow` com `.routine-step` e `.step-number`.
   - Converteu a seção de preços para `.assistencia-pricing-grid` com `.assistencia-price-card`.
   - Converteu a seção de FAQ para `.assistencia-faq` com `.assistencia-faq__list`.

3. **Lapidação no CSS Global (`produtos/assets/produtos.css`)**:
   - Adicionou estilos para contraste de listas (`ul.clean li`) em temas escuros (`#CBD5E1`).
   - Adicionou estilização e conectores específicos para `.routine-step::after` em ciano e azul clínico.
   - Adicionou estilização dark para `.assistencia-faq` em `.odonto-product-page` e `.therapy-product-page`.
   - Adicionou estilização dark para `.assistencia-price-card`.

## Arquivos

### Criados

- `.Agent/REGISTROS/2026-11-08-1350-antigravity-lapidacao-visual-odonto.md`

### Modificados

- `produtos/gestao-odonto.html`
- `produtos/assets/produtos.css`

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `git status --short` | Apenas arquivos pretendidos foram alterados |
| `git diff --check` | 0 erros de whitespace ou quebras de linha |
| `Get-Content produtos/gestao-odonto.html -Encoding utf8` | UTF-8 íntegro sem mojibake |

## Estado final

- Status: Concluído com sucesso.
- Aprovação local: Pronta para validação pelo usuário.

