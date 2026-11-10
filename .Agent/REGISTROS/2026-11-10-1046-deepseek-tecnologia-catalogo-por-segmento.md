# Registro de ação

## Identificação

- Data: `2026-11-10`
- Horário e fuso: `10:46 America/Sao_Paulo`
- Agente: DeepSeek (DeepSeek Harness)
- Pacote ou tarefa: Página de tecnologia — remoção dos portais de entrada das abas do catálogo
- Solicitação de origem: "em cada aba do catálogo, existe uma espécie de portal de entrada, vamos remover para ficar padrão igual ao Sistemas de Gestão, onde o cliente clica no segmento e já aparece o catálogo logo abaixo"
- Branch: `main`

## Escopo

- Objetivo: eliminar os cards de portal das abas Sites Premium, Landing Pages, Projetos sob Consulta e E-commerce, exibindo o catálogo de cada segmento imediatamente abaixo da aba, com a mesma anatomia dos cards de Sistemas de Gestão.
- Arquivos permitidos: `tecnologia/tecnologia.html`, `tecnologia/style.css`, `tecnologia/script.js`.
- Arquivos reservados: não tocados (`servicos/*`, `produtos/*`, `index.html`).
- Critérios de aceite: nenhuma aba vazia; cards com título, estado do modelo, resumo, descrição e duas ações; links apontando para destinos reais; nenhuma regra CSS do portal remanescente; demais abas e a aba Sistemas de Gestão preservadas.

## Estado inicial

- Git: `main` limpa exceto `tecnologia/style.css` e `tecnologia/tecnologia.html` desta sessão.
- Testes: não aplicável (página estática sem suíte).
- Lint: sem linter na raiz do site.
- Build: sem etapa de build.
- Riscos conhecidos: as abas só continham o card de portal — removê-lo sem substituição deixaria quatro abas vazias.

## Ações realizadas

1. Substituídos os quatro `category-portal-card` por catálogos de cards:
   - Sites Premium: 6 cards (Clínica & Saúde, Arquitetura & Engenharia, Advocacia, Imobiliária, Restaurante & Gastronomia, Clínica de Estética & Spa), cada um abrindo o modelo em `sites-premium/<segmento>/`.
   - Landing Pages: 12 cards (Captura de Leads, Diagnóstico via WhatsApp, Agendamento & Orçamento, Lançamento/SaaS, Material Rico, Evento/Webinar, Case de Sucesso, Comparativo, Release Notes, Lista de Espera, Oferta Relâmpago, Link na Bio).
   - Projetos sob Consulta: 5 cards (Dashboards & B.I., ERP Sob Medida, CRM B2B, Sites Premium, Portais & Intranet).
   - E-commerce: 10 cards (Moda, Eletrônicos, Supermercado/Delivery, B2B/Atacado, Infoprodutos, Assinaturas, Peças Automotivas, Saúde & Farmácia, Móveis, Cosméticos).
2. Cards construídos com as classes existentes de `Sistemas de Gestão` (`system-card-header`, `system-card-title`, `system-card-meta`, `system-card-summary`, `system-card-description`, `system-card-actions`), sem mídia.
3. Conteúdo dos cards transposto das páginas internas já existentes, sem inventar escopo novo; o estado do modelo (`Demo conceitual`, `Modelo navegável`, `Estrutura sob diagnóstico`, `Modelo visual adaptável`) foi preservado de cada origem.
4. Cada card tem duas ações: abrir o modelo/demo e consultar pelo WhatsApp, usando as chaves `data-offer` já mapeadas em `script.js`.
5. Adicionadas as duas chaves ausentes em `OFFER_MESSAGES`: `site-premium-gastronomia` e `site-premium-estetica`.
6. Incluído um link discreto de rodapé por aba (`segment-pane__foot`) para a página completa do segmento, mantendo as páginas internas alcançáveis sem reintroduzir um portal de entrada.
7. Grids das quatro abas alinhados ao padrão de Sistemas de Gestão (`grid-cols-1 md:grid-cols-2 gap-6`).
8. Removido o bloco CSS `PORTAL DE CATEGORIAS` (257 linhas, de `.category-portal-card` a `.category-portal-tag`), sem uso após a troca.
9. Adicionado CSS enxuto para `.segment-card` e `.segment-pane__foot`.
10. Removido o comentário `placeholder` obsoleto que dizia que os cards de segmento haviam sido movidos em 2026-07-30.

## Arquivos

### Criados

- Nenhum.

### Modificados

- `tecnologia/tecnologia.html`
- `tecnologia/style.css`
- `tecnologia/script.js`

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| Verificação de links locais da página (script Node) | 51 links, 0 quebrados |
| Verificação de `data-offer` contra `OFFER_MESSAGES` | 33 cards; todas as chaves de WhatsApp dos cards existem |
| `node --check tecnologia/script.js` | Sintaxe válida |
| Balanço de tags (`section`, `div`, `article`, `a`, `button`, `span`, `p`, `h1`–`h4`) | Todos equilibrados |
| Balanço de chaves do CSS | 137 / 137 |
| Busca por `category-portal` / `portal-preview` | Nenhuma ocorrência em HTML ou CSS |
| Contagem de cards por aba | gestão 8 · premium 6 · landing 12 · projetos 5 · e-commerce 10 |
| `git diff --check -- tecnologia` | Sem erros |

## Ajustes fora do escopo

- Duas mensagens de WhatsApp adicionadas em `script.js` (`site-premium-gastronomia`, `site-premium-estetica`), necessárias porque os cards novos usam essas chaves.

## Pendências e riscos

- **Validação visual pendente**: conferir as quatro abas em desktop e mobile, em especial a altura dos cards (resumo em escala grande herdada de `article[data-offer] h4`) e o alinhamento das duas ações.
- **Commit cruzado**: durante esta sessão outro agente commitou `c9ca791` e levou junto `tecnologia/tecnologia.html` e `tecnologia/script.js` desta tarefa. As mudanças de `tecnologia/style.css` (bloco `.segment-card`, `.segment-pane__foot` e remoção do CSS do portal) permanecem **não commitadas** — o HTML no HEAD depende delas para renderizar como projetado.
- O registro desta sessão (`2026-11-10-1038-deepseek-tecnologia-abertura-catalogo-e-navbar.md`) segue não versionado.
- Observação encontrada e não corrigida (fora do escopo): o card do Gestão Gastro usa `data-offer="gestao-gastro"`, mas `OFFER_MESSAGES` registra `'gestão-gastro'` (com acento); a mensagem cai no texto genérico de diagnóstico.

## Estado final

- Status: implementado, aguardando validação local e visual do responsável.
- Commit: não realizado por este agente.
- Push: não realizado.
- Aprovação local: pendente.

## Adendo — 2026-11-10 10:52 — Ordem das abas

- Solicitação: "inverta a sessão e-commerce X Projetos sob consulta, para que o Projetos Sob Consulta fiquem por último".
- Ordem anterior: Sistemas de Gestão · Sites Premium · Landing Pages · Projetos sob Consulta · E-commerce.
- Ordem atual: Sistemas de Gestão · Sites Premium · Landing Pages · E-commerce · Projetos sob Consulta.
- Ações: os dois botões do `tablist` foram invertidos e os painéis `#tab-sites` e `#tab-ecom` foram movidos no HTML para que a ordem do código passe a refletir a ordem visual. `id`, `data-target`, `aria-controls` e `aria-labelledby` foram preservados; a navegação por teclado passou a seguir a nova ordem automaticamente por derivar do DOM.
- Validações: botões e painéis na mesma ordem; nenhum `id` duplicado; contagem de cards inalterada (gestão 8 · premium 6 · landing 12 · e-commerce 10 · projetos 5); 51 links locais com 0 quebrados; tags equilibradas; `git diff --check` limpo.
- Nenhum CSS precisou de ajuste.

## Adendo — 2026-11-10 10:56 — Cor de destaque em laranja

- Solicitação: "aplique a cor de destaque por toda página, que hoje chama para o amarelo e traga o tom de destaque da marca Plena no Laranja".
- Diagnóstico: a cor de destaque não estava tokenizada. `tecnologia/style.css` tinha 23 valores de dourado fixos (`#D4AF37`, `rgba(212, 175, 55, α)`, `#F3DF98`, `#8A6810`, `#C39E2E`) e `tecnologia.html` tinha 18 (`#D4AF37` em classes utilitárias, favicon, `selection` e `#D6A23A` no rodapé).
- Ações:
  1. `style.css` passou a expor quatro tokens: `--accent`, `--accent-strong`, `--accent-light`, `--accent-deep`. Os valores padrão continuam dourados, então as páginas irmãs que compartilham o arquivo não mudaram.
  2. Todos os valores fixos foram trocados por esses tokens; as variantes com transparência usam `color-mix(in srgb, var(--accent) N%, transparent)`.
  3. `tecnologia.html` sobrescreve os quatro tokens no `<head>` com o laranja da marca: `--accent: #F26A1B`, `--accent-strong: #D9560F`, `--accent-light: #FFC49A`, `--accent-deep: #A63F0C`.
  4. As 18 ocorrências de dourado na página foram substituídas por `#F26A1B`, incluindo favicon, `selection`, ícones, numerais de etapa, eyebrows e links do rodapé. A paleta `brand` do Tailwind foi preservada intacta (apenas define tokens da marca).
  5. `tecnologia/ecommerce/index.html` tinha um `style="color:var(--accent-gold)"`; como o token foi renomeado para `--accent`, a referência foi corrigida para não perder a cor.
- Resultado cromático na página: laranja `#F26A1B` como cor principal, `#D9560F` no hover dos botões, `#A63F0C` nos chips de preço sobre fundo claro e `#FFC49A` nos contornos de foco. O rodapé, que já usava laranja, ficou coerente com o resto da página.
- Validações: `style.css` parseado com PostCSS (132 regras, 14 `color-mix` bem formados, nenhum aviso); nenhum resquício de dourado em `tecnologia.html` além da paleta `brand`; tags HTML equilibradas; `git diff --check` limpo; contraste conferido (laranja sobre escuro ≈ 6.4:1; `--accent-deep` sobre chip claro ≈ 5.7:1).
- Fora do escopo, sem alteração: `tecnologia/landing-pages/index.html`, `tecnologia/ecommerce/index.html` e `tecnologia/projetos-sob-consulta/index.html` continuam douradas (têm `--accent-gold` próprio e hexes fixos no HTML). Se a intenção for estender o laranja a toda a seção de Tecnologia, é uma decisão separada.

## Adendo — 2026-11-10 11:04 — Remoção do acesso aos portais

- Solicitação: "pode remover o botão de acesso aos portais, acredito que desta forma o cliente tenha menos cliques e chegue mais rapidamente onde importa que é ver e navegar pelo modelo".
- Ações: removidos os quatro links `segment-pane__foot` ("Ver o portal de Sites Premium", "Ver a página completa de landing pages / e-commerce / projetos sob consulta") e o CSS correspondente. O cliente passa a ir do card direto ao modelo.
- Validações: 47 links locais, 0 quebrados; 33 cards de segmento preservados; tags equilibradas; `git diff --check` limpo nos arquivos desta tarefa.
- **Consequência registrada**: `tecnologia/landing-pages/index.html`, `tecnologia/ecommerce/index.html` e `tecnologia/projetos-sob-consulta/index.html` ficaram **sem nenhum link interno** (continuam no `sitemap.xml`). `sites-premium/index.html` segue alcançável pelos seis modelos. Precisa de decisão: aposentar com 301, remover do sitemap ou recolocar um acesso discreto.
- Auditoria completa da página entregue na conversa, sem novas alterações de código.

## Auditoria — 2026-11-10 11:10

Evidências levantadas por medição direta (nenhuma alteração feita a partir delas):

- HTML: 94,6 KB, 1.626 linhas, não minificado.
- Imagens carregadas na página: **13,09 MB** — `logoplena.svg` 4,52 MB + 7 screenshots somando 8,58 MB, todas sem `loading="lazy"` nem `decoding`.
- Dependências externas no caminho crítico: Tailwind Play CDN, Phosphor Icons, Google Fonts, GTM.
- Título, meta description, H1 e schema JSON-LD prometem "automações com IA"; o catálogo não tem nenhuma oferta de automação.
- 33 ofertas no catálogo: 8 com preço e página de produto, 25 apenas com demo.
- Duas mecânicas de demo: 8 em modal interno, 25 abrindo nova aba.
- `#demo-modal` sem `role="dialog"`, `aria-modal` ou rótulo; `script.js` procura `#demo-newtab`, elemento que não existe.
- Hierarquia de títulos: `h1` seguido de 33 `h3` (sem `h2` na seção do catálogo).
- GA4 comentado no `<head>`; `trackIntent` depende de `window.gtag` e nada usa `dataLayer`, portanto tab, demo e WhatsApp não são medidos.
- Código morto: `solutionCatalog` (declaração sem uso), máquina de filtros por nicho (`NICHE_FILTERS` vazio, ~70 linhas), 7 classes CSS sem uso (`tech-nav-brand*`, `niche-*`, `card-hidden`).
- Divergência de preço: card do Assistência Pro anuncia "a partir de R$ 59,90/mês"; `produtos/assistencia-pro.html` informa R$ 97,90/mês.

## Adendo — 2026-11-10 11:20 — Aposentadoria das páginas de portal e novo segmento Automações e IA

### Decisão 1 — aposentar as três páginas órfãs

- Removidos: `tecnologia/landing-pages/index.html`, `tecnologia/landing-pages/style.css`, `tecnologia/ecommerce/index.html`, `tecnologia/ecommerce/style.css`, `tecnologia/projetos-sob-consulta/index.html`, `tecnologia/projetos-sob-consulta/style.css`. As pastas `ecommerce` e `projetos-sob-consulta` ficaram vazias e foram removidas.
- Preservados: os 10 modelos `landing-pages/lp-*.html` (usados pelos cards) e todas as demos em `tecnologia/demos/`.
- `.htaccess`: três regras 301 com fragmento para a aba correspondente do catálogo, cobrindo a pasta e o `index.html`. Os modelos individuais não são afetados pelo padrão.
- `sitemap.xml`: as três URLs removidas (de 15 para 12).
- `script.js`: o deep link, que só tratava `#sites-premium`, virou um mapa (`DEEP_LINK_TABS`) com `#sites-premium`, `#landing-pages`, `#ecommerce`, `#automacoes` e `#projetos-consulta`.

### Decisão 2 — criar a oferta e o segmento de Automações e IA

- Nova aba `tab-automacao` ("Automações e IA"), posicionada antes de "Projetos sob Consulta", que permanece por último.
- Cinco cards com uma única ação de WhatsApp cada (não há modelo navegável para serviços): Atendimento no WhatsApp, Encaminhamento de Leads, Integrações entre Sistemas, Lembretes e Rotinas, Assistente de IA com o seu Conteúdo.
- Escopo ancorado no que o site já assume entregar, sem inventar capacidade: FAQ de projetos cita integrações com gateway de pagamento, nota fiscal e WhatsApp API; a página de landing pages cita encaminhamento para e-mail, planilha, CRM e robôs de WhatsApp; o texto principal já fala em "automatizar atendimento".
- O card de IA explicita o limite ("quando não sabe, transfere para uma pessoa — nunca decide sozinho"), coerente com o posicionamento dos produtos, que recusam diagnóstico automático por IA.
- Nenhum preço foi criado: todos os cards estão como "Projeto sob diagnóstico".
- Seis mensagens novas em `OFFER_MESSAGES`; oferta "Automações e Integrações com IA" incluída no `hasOfferCatalog` do JSON-LD.
- CSS: `.segment-card--single` para o card de ação única.

### Validações deste adendo

| Verificação | Resultado |
| --- | --- |
| Ordem de abas e painéis | `gestão > premium > landing > e-commerce > automação > projetos` nos dois, coerentes |
| Cards por aba | 8 · 6 · 12 · 10 · 5 · 5 |
| Ofertas sem mensagem de WhatsApp | nenhuma entre as usadas em botões |
| Links locais da página | 47, nenhum quebrado |
| JSON-LD | válido, 4 serviços |
| `node --check script.js` | aprovado |
| Tags HTML / chaves CSS | equilibradas (136/136) |
| `sitemap.xml` | XML válido, 12 URLs |
| Referências restantes às páginas removidas | nenhuma fora de `deploy/` |
| `git diff --check` (arquivos desta tarefa) | limpo |

### Pendências

- Validar visualmente as 6 abas em 768 px: a barra de abas passou de 5 para 6 itens e pode exigir rolagem horizontal nessa largura.
- Conferir se os ícones novos (`ph-chat-circle`, `ph-plugs`, `ph-bell-ringing`, `ph-robot`) renderizam na versão do Phosphor carregada.
- Preço e escopo das automações precisam de aprovação comercial; não foram documentados em `docs/comercial/TABELA-DE-PRECOS-E-FERRAMENTAS.md`.
- Publicação real dos 301 depende de o servidor aplicar o `.htaccess`.

## Adendo — 2026-11-10 11:32 — Briefing guiado em Projetos sob Consulta

- Solicitação: "na aba de projetos sob consulta, aplicar uma ação de filtragem onde o cliente é direcionado a nos mostrar exatamente o que ele precisa, caso nenhuma das opções anteriores nas abas seja o que ele precisa".
- Interpretação adotada: a aba passa a acolher o pedido que não coube nas outras abas. Em vez de filtrar os cinco cards de referência, um briefing de três perguntas monta o pedido do cliente e o leva ao WhatsApp com contexto pronto.
- Estrutura: painel `briefing-panel` no topo da aba, com três grupos de escolha única (necessidade, situação atual, prioridade), campo opcional de observação (280 caracteres), resumo ao vivo em `aria-live` e duas ações (enviar pelo WhatsApp / limpar).
- Escolhas em rádio nativo dentro de `fieldset` + `legend`: teclado, leitores de tela e estado selecionado vêm do próprio controle, sem script de navegação.
- O botão de envio fica desabilitado até as três respostas; nada é enviado sem clique explícito; nenhum dado é armazenado.
- Roteamento de retorno: quando a necessidade escolhida coincide com uma linha existente (site institucional, página de campanha, loja virtual, automação), aparece um link que troca para a aba correspondente. As demais combinações seguem direto para o diagnóstico.
- Sem promessa de resultado e sem preço: o pedido termina em "Gostaria de um diagnóstico".
- Implementação: `tecnologia.html` (painel e formulário), `tecnologia/script.js` (composição do resumo, mensagem, validação e roteamento) e `tecnologia/style.css` (painel, chips, campo, resumo e ações).

### Validações deste adendo

| Verificação | Resultado |
| --- | --- |
| `node --check script.js` | aprovado |
| Estrutura do formulário | 1 `form`, 3 `fieldset`, 3 `legend`, 14 rádios (6 + 4 + 4) |
| `id` duplicados | nenhum |
| Cards preservados na aba | 5 |
| Links locais | 47, nenhum quebrado |
| CSS via PostCSS | 164 regras, sem erro |
| Chaves CSS | 170/170 |
| Tags HTML | equilibradas |
| `git diff --check` | limpo |

### Pendências

- Validar visualmente o painel em desktop e mobile, incluindo o estado desabilitado do botão e o resumo ao vivo.
- Revisar os textos das três perguntas e das opções, que são proposta editorial.
- O commit continua pendente; outro agente deixou arquivos de `tecnologia/demos/gestao-sorveteria/` em stage, que não são desta tarefa.

## Adendo — 2026-11-10 13:02 — Projetos sob Consulta vira atendimento guiado

- Solicitação: "na aba projetos sob consulta, vamos focar em automatizar o atendimento ao cliente para chegar no que ele precisa, assim, pode remover as demais referências de sistemas e ampliar a capacidade de filtragem e direcionamento".
- Removidos os cinco cards de referência da aba (Dashboards & B.I., ERP Sob Medida, CRM B2B, Sites Premium, Portais & Intranet). A aba agora contém apenas o briefing.
- Briefing ampliado de três para quatro perguntas e de 14 para 27 opções:
  1. Qual é o seu negócio? (9 opções de segmento)
  2. O que você precisa montar? (10 opções, incluindo dashboard, ERP, CRM e portal)
  3. Como isso funciona hoje? (4)
  4. O que mais pesa agora? (4)
- Roteamento ampliado: cada necessidade aponta para um destino real.
  - Sistema de gestão → aba Sistemas de Gestão e, se o negócio for reconhecido, rola até o card exato do produto e o destaca por alguns segundos (`is-briefing-focus`).
  - Dashboard, ERP, CRM e portal → abrem a demo conceitual correspondente em `demos/projetos-b2b/`.
  - Site institucional, página de campanha, loja virtual e automação → abrem a aba correspondente do catálogo.
  - "Ainda não sei" e "outro negócio" → seguem apenas para o WhatsApp.
- O resumo montado virou mensagem com quatro frases (negócio, necessidade, situação e prioridade) e a observação opcional.
- Nada foi perdido comercialmente: as ofertas que saíram como card continuam acessíveis como opção da triagem e pela demo.

### Validações deste adendo

| Verificação | Resultado |
| --- | --- |
| Cards na aba Projetos sob Consulta | 0 (eram 5) |
| Grupos de pergunta / opções de resposta | 4 / 27 |
| Chaves de rota no JS × opções do HTML | 9 de 10 necessidades com rota ("ainda não sei" sem rota); nenhuma rota órfã |
| Segmentos com card × opções de negócio | 8 de 9 ("outro negócio" sem card); nenhum card órfão |
| Links locais da página | 39, nenhum quebrado |
| `node --check script.js` | aprovado |
| CSS via PostCSS | 171 regras, sem erro |
| Tags HTML / chaves CSS | equilibradas |
| `git diff --check` nos arquivos desta tarefa | limpo |

### Pendências deste adendo

- Validar visualmente: a aba agora tem 27 chips em quatro blocos e ficou longa no mobile. Se pesar, o caminho é transformar em wizard de uma pergunta por tela.
- `tecnologia/demos/projetos-b2b/demo-site-premium.html` ficou sem referência (era o card "Sites Premium" da aba). Continua acessível por URL direta.
- Conferir o destaque `is-briefing-focus` no card indicado e o novo botão "Caminho sugerido".

## Adendo — 2026-11-10 12:54 — Revisão de UI/UX para mobile

- Solicitação: "aplique uma revisão em UI/UX com foco em mobile".
- Diagnóstico por leitura do CSS/HTML: barra de abas com rolagem horizontal escondia quatro das seis categorias; sumários dos cards herdavam `clamp(1.75rem, 3.1vw, 3.35rem)` e ficavam com 28 px no celular; chips do briefing com 40 px de altura (abaixo dos 44 px recomendados); contato dependia de abrir o menu (3 toques); `#demo-modal` sem `role="dialog"` e sem o link `#demo-newtab` que o próprio script procurava; oito screenshots sem `loading="lazy"`.
- Aplicado:
  1. CTA fixo de WhatsApp no rodapé da viewport, só abaixo de 768 px, com `env(safe-area-inset-bottom)` e `padding-bottom` no `body` para não cobrir conteúdo.
  2. Barra de categorias virou grade 2 × 3 no mobile: as seis abas ficam visíveis, sem rolagem horizontal escondida.
  3. Hierarquia tipográfica dos cards corrigida no mobile: título 1.3 rem, resumo 1.1 rem, descrição 0.9 rem.
  4. Abertura do catálogo ajustada: título 1.75 rem e lead 0.95 rem.
  5. Alvos de toque: chips 2.75 rem, botão de rota e "Limpar respostas" em largura total com 2.75 rem.
  6. Modal de demonstração recebeu `role="dialog"`, `aria-modal` e rótulo; foi criado o link "Nova aba" (`#demo-newtab`) que o `script.js` já atualizava mas não existia no HTML — é a saída do iframe apertado no celular. A barra ficou mais compacta no mobile (os três pontos decorativos ficam ocultos).
  7. Os oito screenshots de sistema passaram a usar `loading="lazy"` e `decoding="async"`.

### Validações deste adendo

| Verificação | Resultado |
| --- | --- |
| CSS via PostCSS | 192 regras, sem erro |
| Chaves CSS | 201/201 |
| Tags HTML | equilibradas (`div`, `aside`, `article`, `a`, `button`, `span`, `p`, `h3`, `h4`, `form`, `fieldset`, `label`) |
| `node --check script.js` | aprovado |
| Links locais | 39, nenhum quebrado |
| `#demo-newtab` / `mobile-cta` / `role="dialog"` | presentes |
| Imagens com `loading="lazy"` | 8 |
| `git diff --check` | limpo |

### Pendências deste adendo

- **Maior dívida mobile não resolvida**: os oito screenshots somam ~8,5 MB e o logo 4,5 MB. O lazy loading adia o custo, não o reduz. O próximo passo é gerar WebP redimensionado (≈1.400 px) e trocar o logo.
- Validar visualmente em 375 px e 320 px: grade de abas, CTA fixo sobre o rodapé, modal de demo e briefing.
- O briefing tem 27 chips; se a densidade incomodar no celular, o caminho é wizard de uma pergunta por tela.

## Adendo — 2026-11-10 13:15 — Capas padronizadas em Sistemas de Gestão

- Solicitação: "na aba de Sistema de Gestão padronize as imagens de capa de cada sistema, mantendo o padrão visual da página como um todo".
- Diagnóstico das oito capas existentes por inspeção direta dos arquivos:
  - quatro fachadas noturnas (assistência, barbearia, gastronomia, beleza), 1672×941, coesas entre si;
  - `heroterapia.png` com 1024×1024, interior claro de recepção "Clínica Vitalis" — além de fora de proporção, é a imagem do modelo premium de clínica, não do sistema de terapia;
  - `heroodonto.png` com foto de banco de imagens de um ortopedista examinando o joelho de um paciente — conteúdo sem relação com odontologia;
  - `herofit.png` e `herolavarapido.png` como capturas de tela de interface, um terceiro gênero visual;
  - `heroterapia.png` era, na verdade, um JPEG com extensão `.png`.
  - Resultado: três linguagens visuais distintas e duas imagens erradas.
- Decisão: substituir as oito capas por um template único de capa, em vez de tentar equalizar fotografias de gêneros diferentes. As imagens originais foram preservadas para reversão e continuam em uso nas páginas de produto.
- Template: fundo em gradiente azul-noite, brilho radial na cor do segmento, grade de pontos discreta, moldura abstrata de janela de software, fio de destaque, marca "PLENA" e, no rodapé, o rótulo "SISTEMA DE GESTÃO" com o nome do segmento.
- Cada capa leva o nome do **segmento**, não o do produto — assim a imagem complementa o título do card em vez de repeti-lo.
- Saída: `assets/images/capas/capa-<slug>.webp`, 1280×680 (16:8.5, a proporção do card), WebP qualidade 90.
- Peso: de ~8,5 MB em PNG para **114 KB** nas oito capas.
- `tecnologia.html`: as oito `<img>` passaram a apontar para as capas novas, com `alt` descritivo ("Capa do sistema X") e `loading="lazy"` preservado.
- Convenção para novos sistemas: `assets/images/capas/capa-<slug>.webp`, 1280×680, mesmo template.

### Validações deste adendo

| Verificação | Resultado |
| --- | --- |
| Arquivos gerados | 8, todos 1280×680 WebP |
| Peso total das capas | 114 KB |
| Imagens da página resolvendo | 12 de 12 (incluindo as de outros agentes), nenhuma quebrada |
| `<img>` sem `alt` | 0 |
| Tags HTML | equilibradas |
| `git diff --check` | limpo |

### Pendências deste adendo

- Validar visualmente as capas nas larguras de card (desktop e mobile) e conferir se as matizes por segmento agradam.
- `heroterapia.png`, `heroodonto.png` e `herofit.png` ficaram sem uso no site (continuam no repositório). `heroodonto.png` e `heroterapia.png` têm conteúdo inadequado e devem ser descartados quando houver arte nova.

## Adendo — 2026-11-10 13:25 — Capas padronizadas nos 11 sistemas

- Solicitação: "padronize as capas no mesmo estilo das demais seções. Aplique nos 11 sistemas da aba sistemas de gestão."
- Contexto: a aba cresceu de 8 para 11 cards durante a sessão, com a entrada de Sorveteria & Açaí Pro, Gestão PDV Pro e Gestão Salas Pro (trabalho de outro agente). Esses três ainda usavam PNG fora do padrão.
- Ação: as onze capas foram regeradas pelo mesmo template, garantindo que não haja desvio entre as oito antigas e as três novas.
- Segmentos e matizes acrescentados: Sorveteria & açaí (magenta), Frente de caixa & varejo (laranja-vermelho), Sublocação de salas (violeta). Nomes conferidos nas páginas de produto correspondentes.
- `tecnologia.html`: as três `<img>` restantes passaram a apontar para `assets/images/capas/`, com `alt` no padrão "Capa do sistema X".
- Nenhuma referência a `assets/images/hero*.png` sobrou na aba.

### Validações deste adendo

| Verificação | Resultado |
| --- | --- |
| Capas geradas | 11 |
| Peso total | 157 KB |
| Cards na aba | 11, todos com capa nova |
| Imagens quebradas | 0 |
| `<img>` sem `alt` | 0 |
| Referências a `hero*.png` na aba | 0 |
| Tags HTML / `git diff --check` | equilibradas / limpo |

### Pendências deste adendo

- Validar visualmente as onze capas; os pares terapia/fit, odonto/lava-rápido e sorveteria/salas têm matizes próximas e dependem do texto do segmento para se diferenciar.
- `herosorveteria.png`, `heropdv.png` e `herosalas.png` também ficaram sem uso no site.
