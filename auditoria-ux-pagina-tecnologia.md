# Auditoria UX — Página de Tecnologia (tecnologia/tecnologia.html)

**Data:** 12/06/2026 · **Escopo:** tecnologia.html, script.js, style.css e arquivos referenciados

---

## 1. Resumo executivo

A página tem uma base forte: proposta de valor clara, demos reais funcionando (todas as 25+ demos referenciadas existem), CTAs de WhatsApp contextualizados e SEO bem estruturado (Schema.org, Open Graph, canonical). Os problemas concentram-se em três frentes: **bugs visuais herdados do tema escuro** (componentes injetados no carrossel ficam quase invisíveis na seção clara), **fricção no carrossel com autoplay** (principal área de conversão da página) e **inconsistências de navegação e conteúdo** que minam a credibilidade.

Severidade geral: nenhum bloqueador de funcionamento, mas 4 itens críticos de experiência que provavelmente reduzem conversão hoje.

---

## 2. Diagnóstico

### 2.1 Crítico (corrigir primeiro)

**C1 — Logo com 240px de altura num header de 80px.**
`<img class="h-60">` (linha 88) dentro de um nav `h-20`. O logo vaza do header e sobrepõe o conteúdo do hero. Provável intenção: `h-10`/`h-12` (como no menu mobile, que usa `h-10`).

**C2 — Filtros de nicho e barra de autoplay invisíveis.**
Os chips de filtro (`.niche-chip`) e a barra de progresso (`.autoplay-bar`) são estilizados para tema escuro (fundo `rgba(255,255,255,0.06)`, texto `#A1A1AA`), mas são injetados via JS dentro da seção `.tech-showcase`, que tem fundo claro (`#f8fafc`). Resultado: contraste quase nulo — o usuário não percebe que existem filtros. Mesmo problema nas setas laterais (`.lateral-arrow`: branco translúcido sobre seção clara).

**C3 — Autoplay no catálogo de produtos.**
O carrossel avança sozinho a cada 4,5s enquanto o usuário lê o card (preço, recursos, CTA). Isso viola a heurística de controle do usuário e a WCAG 2.2.2 (não há botão visível de pausar — a pausa só ocorre por hover, que o usuário não descobre). Num catálogo comercial, o movimento involuntário derruba leitura e clique. `prefers-reduced-motion` também não é respeitado em nenhuma animação (tilt 3D, autoplay, reveal).

**C4 — Promessa quebrada no fluxo de WhatsApp.**
O FAQ afirma: *"A mensagem já informa de qual oferta você veio"*. Na prática, quase todos os botões "Consultar" chamam `openWhatsAppByKey('diagnóstico')` com mensagem genérica. As mensagens específicas (`assistencia`, `gastro`, `clinicas`, `ia`) existem no script mas não são usadas por nenhum botão. O vendedor perde o contexto da origem do lead.

### 2.2 Alto impacto

**A1 — Navegação inconsistente entre desktop e mobile.**
Desktop: Início / Soluções / Como funciona. Mobile: Início / Projetos B2B / Serviços / Personalizados. São dois sites diferentes na cabeça do usuário. Desktop não tem acesso a Serviços e Personalizados; mobile não tem acesso às âncoras da própria página (Soluções, Como funciona, FAQ).

**A2 — Modal de demo sem padrões básicos.**
Não fecha com ESC, não tem focus trap (o teclado "vaza" para a página atrás), não tem indicador de carregamento do iframe (demos pesadas = tela branca por segundos) e não oferece "abrir em nova aba". E o mais importante comercialmente: **não há CTA dentro/ao fechar o modal** — o usuário testa a demo, gosta, e não tem ponte direta para o WhatsApp daquele produto.

**A3 — Carrossel infinito triplica o DOM e confunde a navegação.**
Cada card é clonado 2x para o loop infinito (~75 cards renderizados com backdrop-blur cada). Custo de performance real em máquinas modestas. Clones têm `aria-hidden` mas seus botões continuam alcançáveis por Tab — leitor de tela e teclado encontram botões "fantasma". No desktop, cards de 78vw mostram ~1 item por vez: para ver os 10 modelos de e-commerce são ~10 interações de arrasto.

**A4 — Texto sem acentuação em dezenas de pontos.**
"automacoes", "Catalogo", "disponiveis", "Demonstracao", "Implantacao", "contratacao", "São Jose", "negocio", "rapido"... Numa página que vende profissionalismo digital, isso corrói credibilidade e prejudica SEO (termos de busca acentuados).

**A5 — Acessibilidade estrutural das abas.**
As abas não usam roles ARIA (`tablist`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`). Não há skip link. IDs com caracteres especiais (`#soluções`) funcionam, mas geram URLs encodadas frágeis ao compartilhar.

### 2.3 Médio impacto

- **M1 — Tailwind via CDN + Phosphor via unpkg:** ~400KB de JS bloqueante e aviso de "não usar em produção" no console. Build estático do Tailwind reduziria drasticamente o peso.
- **M2 — Botão "Zap" no header mobile:** microcopy obscuro; "WhatsApp" ou ícone + "Falar agora" comunicam melhor.
- **M3 — `trackIntent` só grava em memória** (`window.plenaTechEvents`): os dados de intenção morrem ao fechar a aba. Sem GA4/Pixel/endpoint, não há como medir nada do que esta auditoria recomenda.
- **M4 — Footer vazio:** sem links de navegação, endereço, CNPJ ou política de privacidade (relevante para LGPD e confiança, já que a página coleta intenção de contato).
- **M5 — Canal único de conversão (WhatsApp):** usuário desktop sem WhatsApp Web ativo não tem fallback (formulário curto ou e-mail visível).
- **M6 — Sem prova social:** zero depoimentos, cases ou logos de clientes numa página que afirma "20 anos em São José dos Campos".

### 2.4 O que está bom (preservar)

Proposta de valor objetiva no hero; demos navegáveis reais (diferencial forte); preços âncora visíveis nos sistemas; seção "Como funciona" em 5 passos; FAQ que antecipa objeções; SEO técnico acima da média; mensagens de WhatsApp pré-preenchidas (quando usadas); responsividade mobile do grid (o carrossel vira grid no mobile, decisão correta).

---

## 3. Plano de evolução funcional (foco em UX)

### Fase 1 — Quick wins (1–2 dias, só correções)

| # | Ação | Resolve |
|---|------|---------|
| 1.1 | Corrigir logo para `h-12` | C1 |
| 1.2 | Criar variantes claras de `.niche-chip`, `.autoplay-bar` e `.lateral-arrow` dentro de `.tech-showcase` (texto `#0f172a`, bordas `rgba(15,23,42,.12)`) | C2 |
| 1.3 | Desligar autoplay por padrão (ou adicionar botão pausar/retomar visível + respeitar `prefers-reduced-motion`) | C3 |
| 1.4 | Ligar cada botão "Consultar" à mensagem específica da oferta (usar `data-offer` já existente para montar a mensagem dinamicamente) | C4 |
| 1.5 | Unificar menus desktop/mobile (mesmos itens + âncoras locais) | A1 |
| 1.6 | ESC fecha modal + spinner de carregamento no iframe | A2 (parcial) |
| 1.7 | Revisão ortográfica completa (acentuação) | A4 |
| 1.8 | Renomear "Zap" → "WhatsApp" | M2 |

### Fase 2 — Conversão e confiança (1 semana)

| # | Ação | Resolve |
|---|------|---------|
| 2.1 | **Ponte demo → venda:** barra fixa no modal de demo com "Gostou? Falar sobre [nome do produto]" + ao fechar, mini-CTA contextual | A2 |
| 2.2 | Substituir carrossel infinito por **grid filtrável** no desktop (os filtros de nicho já existem; o grid elimina clones, autoplay e o custo de 10 arrastos) — manter carrossel só se houver dado mostrando engajamento | A3, C3 |
| 2.3 | Bloco de prova social: 3 depoimentos + setores atendidos + selo "20 anos" | M6 |
| 2.4 | Fallback de contato: formulário curto (nome + WhatsApp + necessidade) ou e-mail clicável na seção final | M5 |
| 2.5 | Footer completo: navegação, contato, endereço, política de privacidade | M4 |
| 2.6 | Instrumentação real: enviar `plenaTechEvents` para GA4 (eventos: tab, filtro, demo aberta, tempo na demo, clique WhatsApp por oferta) | M3 |

### Fase 3 — Estrutura e performance (2–3 semanas)

| # | Ação | Resolve |
|---|------|---------|
| 3.1 | Migrar Tailwind CDN → build compilado; auto-hospedar fontes e ícones (ou SVG inline dos ~20 ícones usados) | M1 |
| 3.2 | Refatorar abas com ARIA completo (`tablist`/`tab`/`tabpanel`), skip link, IDs sem acento com redirect das âncoras antigas | A5 |
| 3.3 | Focus trap no modal + retorno de foco ao elemento de origem | A2 |
| 3.4 | Deep-linking: `?tab=ecommerce&filtro=varejo` na URL para campanhas de anúncio caírem direto no recorte certo | — |
| 3.5 | Comparador simples de planos dos sistemas de gestão (tabela recursos × preço), reaproveitando o `solutionCatalog` já existente no script.js | — |

### Fase 4 — Evolução contínua (backlog)

- **Quiz de diagnóstico** ("Qual seu tipo de negócio? → recomendação + demo + mensagem de WhatsApp pronta") — converte o conceito "escolha pelo problema" em fluxo guiado.
- **Tour guiado dentro das demos** (3–4 tooltips destacando o que olhar) para aumentar percepção de valor no tempo de demo.
- Página de cases com resultados mensuráveis, alimentando a prova social.
- Testes A/B (após 2.6): autoplay on/off, grid vs. carrossel, ordem das abas.

---

## 4. Métricas para validar a evolução

Antes/depois de cada fase, acompanhar: taxa de clique em WhatsApp por oferta (meta principal), taxa de abertura de demo, tempo médio dentro da demo, % de cliques no WhatsApp *após* demo (mede a ponte 2.1), profundidade de navegação nas abas e LCP/CLS no mobile (Lighthouse, hoje penalizados pelo CDN do Tailwind).

---

*Auditoria gerada por análise estática do código. Recomendo validar os itens C2 e C3 visualmente no navegador antes da Fase 1.*
