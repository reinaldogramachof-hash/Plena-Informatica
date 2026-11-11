# Registro de ação

## Identificação

- Data: `2026-11-11`
- Horário e fuso: `14:38 America/Sao_Paulo`
- Agente: `Antigravity`
- Pacote ou tarefa: `Padronização visual e funcional das landing pages de vendas em produtos/ com referência no Gestão Terapia`
- Solicitação de origem: `Padronizar visualmente as demais landing pages de vendas dos sistemas Plena seguindo o Gestão Terapia aprovado (commits fdaaac6 e 9fff885) e o guia produtos/PADRAO-LANDING-PAGES.md`
- Branch: `main`

## Escopo

- Objetivo: Inventariar as 11 páginas de venda em `produtos/`, preservar o piloto aprovado (`gestao-terapia`) e alterações alheias, e executar a padronização página a página (direção visual de segmento, imagem de ambiente, capturas reais da demonstração em perspectiva, painel sólido nos textos, alinhamento à navbar, entrada contextual na demo, planos/preços originais preservados e validação completa por viewport).
- Arquivos permitidos:
  - As 10 páginas de produto alvo em `produtos/` (`gestao-salas.html`, `gestao-odonto.html`, `gestao-fit.html`, `gestao-lavarapido.html`, `gestao-pdv.html`, `gestao-sorveteria.html`, `assistencia-pro.html`, `barbearia-premium.html`, `beleza-spa.html`, `gestao-gastro.html`)
  - Stylesheets e scripts isolados por produto em `produtos/assets/<produto>.css` e `produtos/assets/<produto>.js`
  - Diretórios próprios de imagens por segmento em `assets/images/<segmento>/`
  - Ajustes mínimos de entrada contextual/aparência inicial restritos às respectivas pastas de demonstração em `tecnologia/demos/<produto>/`
  - Testes em `tests/` para contratos adicionados e este registro em `.Agent/REGISTROS/`
- Arquivos reservados:
  - `produtos/gestao-terapia.html`, `produtos/assets/gestao-terapia.css`, `produtos/assets/gestao-terapia.js`, `produtos/assets/logo.png`, `assets/images/terapia/`, `tecnologia/demos/gestao-terapia/`
  - Páginas institucionais (`index.html`), `servicos/`, `tecnologia/tecnologia.html`, `servicos/hub/`, `produtos/assets/produtos.css` (alteração pré-existente preservada), `produtos/assets/produtos.js` (contrato preservado), e seeds modificados fora das necessidades de vitrine (`tecnologia/demos/gestao-odonto/assets/js/demo-seed.js`, `tecnologia/demos/gestao-sorveteria/assets/js/demo-seed.js`)
- Critérios de aceite:
  - Seguir integralmente `produtos/PADRAO-LANDING-PAGES.md` e validar em `1440px` (desktop amplo), `768px`, `375px` e `320px`, além de acessibilidade (teclado, foco, Escape, retorno de foco), roteamento contextual real da demo e integridade de arquivos antes de avançar entre páginas.

## Estado inicial

- Git (`git status --short`): workspace já contém alterações não commitadas de sessões anteriores (`M produtos/assets/produtos.css`, `M produtos/gestao-fit.html`, `M produtos/gestao-odonto.html`, `M produtos/gestao-gastro.html`, `M produtos/gestao-lavarapido.html`, `M produtos/gestao-pdv.html`, `M produtos/gestao-sorveteria.html`, `M produtos/gestao-salas.html`, `M servicos/servicos.html`, `M tecnologia/tecnologia.html`, `M tecnologia/demos/gestao-odonto/assets/js/demo-seed.js`, `M tecnologia/demos/gestao-sorveteria/assets/js/demo-seed.js`, além de `?? produtos/PADRAO-LANDING-PAGES.md`, `?? produtos/assets/gestao-salas.css`, `?? produtos/assets/gestao-salas.js`, `?? .Agent/REGISTROS/*` e `?? scratch_chrome_profile/`).
- Inventário em `produtos/` (11 páginas):
  1. `gestao-terapia.html` — Referência aprovada (preservar intocada).
  2. `gestao-salas.html` — Replicação estrutural/tonal prévia realizada por DeepSeek; pendente de imagem de ambiente, capturas reais da demo, ajuste de abertura para foto, entrada contextual na demo e validação visual renderizada.
  3. `gestao-odonto.html` — Pendente de padronização completa (hero antiga `heroodonto.png` é incompatível com odontologia).
  4. `gestao-fit.html` — Pendente de padronização completa.
  5. `gestao-lavarapido.html` — Pendente de padronização completa.
  6. `gestao-pdv.html` — Pendente de padronização completa.
  7. `gestao-sorveteria.html` — Pendente de padronização completa.
  8. `assistencia-pro.html` — Pendente de padronização completa + atualização de CNPJ no rodapé (`59.779.242/0001-78`).
  9. `barbearia-premium.html` — Pendente de padronização completa + botão `Testar Demo` na navbar + CNPJ no rodapé.
  10. `beleza-spa.html` — Pendente de padronização completa + botão `Testar Demo` na navbar + Lucide próprio + CNPJ no rodapé.
  11. `gestao-gastro.html` — Pendente de padronização completa + remoção de dependência externa/Tailwind/rodapé duplicado + integração de entrada contextual na demo React/Vite + CNPJ no rodapé.
- Sequência de execução:
  `gestao-salas` → `gestao-odonto` → `gestao-fit` → `gestao-lavarapido` → `gestao-pdv` → `gestao-sorveteria` → `assistencia-pro` → `barbearia-premium` → `beleza-spa` → `gestao-gastro`.
- Prévia local: servidor HTTP local já ativo na porta `127.0.0.1:8080` servindo `produtos/gestao-terapia.html` (HTTP 200 conferido).

## Ações realizadas

1. Leitura integral das regras obrigatórias em `AGENTS.md`, `.Agent/*`, `produtos/PADRAO-LANDING-PAGES.md` e dos arquivos de referência do Gestão Terapia (`produtos/gestao-terapia.html`, `produtos/assets/gestao-terapia.css`, `produtos/assets/gestao-terapia.js`, `tecnologia/demos/gestao-terapia/assets/js/demo-entry.js` e `theme.js`).
2. Inventário das 11 páginas de venda em `produtos/`, inspeção visual de referência (`assets/images/terapia/` e `assets/images/hero*.png`) e levantamento das rotas/temas iniciais das 10 demonstrações em `tecnologia/demos/`.
3. Abertura deste registro antes de iniciar edições de código ou geração de ativos.
4. Padronização visual, comercial, funcional e acessível executada sequencialmente nas 10 páginas-alvo, concluindo e validando cada página antes de avançar para a próxima (`gestao-salas` → `gestao-odonto` → `gestao-fit` → `gestao-lavarapido` → `gestao-pdv` → `gestao-sorveteria` → `assistencia-pro` → `barbearia-premium` → `beleza-spa` → `gestao-gastro`):
   - **Estrutura editorial & Hero**: aplicação da navbar padrao do sistema (marca à esquerda + navegação curta, botão de demo e WhatsApp à direita + gaveta móvel acessível), hero com fotografia temática de ambiente em luz natural e gradiente protetor sólido do lado da leitura, e empilhamento vertical limpo em viewports móveis.
   - **Seções de módulos em perspectiva**: alternância esquerda/direita com capturas reais das respectivas demos (`1440x960`) em perspectiva e painel sólido opaco atrás do bloco de texto (sem vidro translúcido/blur nem molduras de navegador), com alinhamento à extremidade direita do WhatsApp nos blocos direitos no desktop e leitura alinhada à esquerda no celular.
   - **Demonstração contextual**: implementação de `demo-entry.js` e ajustes pontuais de inicialização/tema/banner nas 10 pastas de demonstração para suportar abertura contextual por `?view=...` (além de `?patient=` em `gestao-odonto`), preservando integralmente a abertura genérica sem parâmetros. No `gestao-restaurantes` (bundle Vite/React), proteção de `history.replaceState` para preservar o subcaminho `/tecnologia/demos/gestao-restaurantes/`, ocultamento da área Master e supressão de popup guia para manter a primeira tela limpa.
   - **Planos, identidade & integridade**: preservação dos planos, preços e modalidades originais de cada sistema, atualização de CNPJ para `59.779.242/0001-78`, remoção de dependências externas de UI/ícones no `gestao-gastro` (remoção de `@phosphor-icons/web` CDN, Tailwind CDN e rodapé duplicado) e preservação integral de `gestao-terapia`, `index.html`, `servicos/`, `tecnologia/tecnologia.html`, `produtos/assets/produtos.css` e `produtos/assets/produtos.js`.
5. Auditoria transversal final across as 10 páginas: correção de `.product-mobile-menu__actions` nos CSS isolados de `gestao-lavarapido`, `gestao-pdv`, `gestao-sorveteria` e `assistencia-pro`, correção de markup no FAQ do `barbearia-premium`, e revalidação completa das 5 páginas após ajustes.

## Imagens geradas e capturas produzidas

Todas as fotografias de ambiente das heroes foram geradas por subagentes dedicados (`image-generator`) com restrição estrita contra textos, placas, logotipos, telas de interface ou pessoas, otimizadas para Web JPEG (`1376x768`, ~93–159 KB) em `assets/images/<segmento>/`. As capturas dos módulos (`1440x960`, ~78–164 KB) foram tiradas diretamente das respectivas demonstrações reais em execução local com dados fictícios.

| Produto | Diretório | Hero gerada (1376x768) | Capturas reais da demo (1440x960) | Direção visual e origem do prompt da hero |
| --- | --- | --- | --- | --- |
| `gestao-salas` | `assets/images/salas/` | `espaco-coworking.jpg` | `agenda-demo.jpg`, `vistoria-demo.jpg`, `financeiro-demo.jpg` | **Mineral Olive & Sage Loft**: parede de gesso cru e mesa de carvalho à esquerda; sala de reunião envidraçada iluminada pelo sol matinal com cadeiras sálvia/linho e folhagem. Gerada por `Coworking Ambient Photographer` (ref. `coworking_hero_banner_1794418801585.jpg`). |
| `gestao-odonto` | `assets/images/odonto/` | `clinica-odontologica.jpg` | `agenda-demo.jpg`, `prontuario-demo.jpg`, `financeiro-demo.jpg` | **Clinical Alabaster & Mineral Teal**: parede alabastro e console em carvalho claro à esquerda; consultório odontológico contemporâneo em luz natural suave, cadeira ergonômica bege/alabastro e fícus. Gerada por `Dental Clinic Photographer` (ref. `odonto_hero_banner_1794419470890.jpg`). |
| `gestao-fit` | `assets/images/fit/` | `estudio-fit.jpg` | `agenda-demo.jpg`, `alunos-demo.jpg`, `financeiro-demo.jpg` | **Botanical Chalk & Deep Forest**: parede mineral clara à esquerda; estúdio boutique de personal trainer em luz diurna com piso em carvalho, rack preto fosco com halteres/kettlebells e jardim externo. Gerada por `Personal Studio Photographer` (ref. `fit_hero_banner_1794420218712.jpg`). |
| `gestao-lavarapido` | `assets/images/lavarapido/` | `estetica-automotiva.jpg` | `patio-demo.jpg`, `os-demo.jpg`, `caixa-demo.jpg` | **Cool Architectural Bay & Cerulean**: divisória de vidro fosco e piso epóxi claro à esquerda; box limpo de estética automotiva com veículo prata/branco-pérola sob luz natural e gotículas no capô (sem placas). Gerada por `Automotive Detailing Photographer` (ref. `plena_hero_car_detailing_1794421208239.jpg`). |
| `gestao-pdv` | `assets/images/pdv/` | `emporio-caixa.jpg` | `pdv-demo.jpg`, `estoque-demo.jpg`, `dashboard-demo.jpg` | **Warm Market Linen & Emerald**: parede em estuque claro e borda travertino à esquerda; balcão de empório gourmet em carvalho claro com leitor sem fio, impressora térmica e cesta de pães artesanais (embalagens sem texto). Gerada por `Market Countertop Photographer` (ref. `gourmet_retail_hero_1794422062412.jpg`). |
| `gestao-sorveteria` | `assets/images/sorveteria/` | `sorveteria-balcao.jpg` | `caixa-demo.jpg`, `producao-demo.jpg`, `freezers-demo.jpg` | **Cream Gelato Pearl & Berry Crimson**: parede creme fosca e travertino à esquerda; vitrine minimalista de aço escovado com cubas de gelato/açaí, cones, potes de frutas/castanhas e balança limpa à direita. Gerada por `Gelateria Ambient Photographer` (ref. `plena_hero_counter_1794422672265.jpg`). |
| `assistencia-pro` | `assets/images/assistencia/` | `assistencia-bancada.jpg` | `ordens-demo.jpg`, `estoque-demo.jpg`, `pdv-demo.jpg` | **Clean Tech Lab Slate & Cobalt**: parede clara e bancada de pedra à esquerda; bancada antiestática organizada sob luz de janela com smartphone aberto, chaves de precisão anodizadas e pinças ESD (v2 refinada para remover marcas/textos). Gerada por `Electronics Repair Lab Photographer` (ref. `tech_repair_workbench_hero_v2_1794423442220.jpg`). |
| `barbearia-premium` | `assets/images/barbearia/` | `barbearia-salao.jpg` | `agenda-demo.jpg`, `financeiro-demo.jpg`, `pdv-demo.jpg` | **Warm Linen Parchment & Heritage Amber**: parede em gesso creme e prateleira travertino à esquerda; cadeira clássica de barbeiro em couro conhaque, espelho em arco de latão e toalhas de linho em luz matinal. Gerada por `Barbershop Ambient Photographer` (ref. `barbershop_hero_backdrop_1794423960155.jpg`). |
| `beleza-spa` | `assets/images/beleza/` | `beleza-salao.jpg` | `agenda-demo.jpg`, `financeiro-demo.jpg`, `estoque-demo.jpg` | **Rose Alabaster & Botanical Burgundy**: parede em gesso alabastro rosado à esquerda; poltrona bouclé creme, console travertino rosé, espelho em arco de latão, frascos sem rótulo e oliveira/eucalipto à luz natural. Gerada por `Beauty Studio & Spa Photographer` (ref. `hero_boutique_spa_studio_1794424567360.jpg`). |
| `gestao-gastro` | `assets/images/gastro/` | `gastro-salao.jpg` | `pdv-demo.jpg`, `mesas-demo.jpg`, `estoque-demo.jpg` | **Warm Bistro Linen & Terracotta**: parede marfim-linho em gesso veneziano à esquerda; passa-pratos em carvalho mel e travertino com louças empilhadas, guardanapos de linho, vaso terracota com alecrim e salão iluminado ao fundo. Gerada por `Restaurant & Culinary Pass Photographer` (ref. `gastro_salao_1794425414528.jpg`). |

## Arquivos

### Criados

- `produtos/assets/gestao-odonto.css`, `produtos/assets/gestao-odonto.js`
- `produtos/assets/gestao-fit.css`, `produtos/assets/gestao-fit.js`
- `produtos/assets/gestao-lavarapido.css`, `produtos/assets/gestao-lavarapido.js`
- `produtos/assets/gestao-pdv.css`, `produtos/assets/gestao-pdv.js`
- `produtos/assets/gestao-sorveteria.css`, `produtos/assets/gestao-sorveteria.js`
- `produtos/assets/assistencia-pro.css`, `produtos/assets/assistencia-pro.js`
- `produtos/assets/barbearia-premium.css`, `produtos/assets/barbearia-premium.js`
- `produtos/assets/beleza-spa.css`, `produtos/assets/beleza-spa.js`
- `produtos/assets/gestao-gastro.css`, `produtos/assets/gestao-gastro.js`
- Diretórios e imagens (40 arquivos JPG otimizados para web):
  - `assets/images/salas/{espaco-coworking,agenda-demo,vistoria-demo,financeiro-demo}.jpg`
  - `assets/images/odonto/{clinica-odontologica,agenda-demo,prontuario-demo,financeiro-demo}.jpg`
  - `assets/images/fit/{estudio-fit,agenda-demo,alunos-demo,financeiro-demo}.jpg`
  - `assets/images/lavarapido/{estetica-automotiva,patio-demo,os-demo,caixa-demo}.jpg`
  - `assets/images/pdv/{emporio-caixa,pdv-demo,estoque-demo,dashboard-demo}.jpg`
  - `assets/images/sorveteria/{sorveteria-balcao,caixa-demo,producao-demo,freezers-demo}.jpg`
  - `assets/images/assistencia/{assistencia-bancada,ordens-demo,estoque-demo,pdv-demo}.jpg`
  - `assets/images/barbearia/{barbearia-salao,agenda-demo,financeiro-demo,pdv-demo}.jpg`
  - `assets/images/beleza/{beleza-salao,agenda-demo,financeiro-demo,estoque-demo}.jpg`
  - `assets/images/gastro/{gastro-salao,pdv-demo,mesas-demo,estoque-demo}.jpg`
- Pontos de entrada contextual nas demos:
  - `tecnologia/demos/gestao-salas/assets/js/demo-entry.js`
  - `tecnologia/demos/gestao-odonto/assets/js/demo-entry.js`
  - `tecnologia/demos/gestao-fit/assets/js/demo-entry.js`
  - `tecnologia/demos/gestao-lavarapido/assets/js/demo-entry.js`
  - `tecnologia/demos/gestao-pdv/assets/js/demo-entry.js`
  - `tecnologia/demos/gestao-sorveteria/assets/js/demo-entry.js`
  - `tecnologia/demos/gestao-assistencia/assets/js/demo-entry.js`
  - `tecnologia/demos/gestao-barbearia/js/demo-entry.js`
  - `tecnologia/demos/gestao-beleza/js/demo-entry.js`
  - `tecnologia/demos/gestao-restaurantes/js/demo-entry.js`
- Testes automatizados de entrada contextual e abertura genérica (10 arquivos, 13 testes):
  - `tests/salas-demo-entry.test.js`, `tests/odonto-demo-entry.test.js`, `tests/fit-demo-entry.test.js`, `tests/lavarapido-demo-entry.test.js`, `tests/pdv-demo-entry.test.js`, `tests/sorveteria-demo-entry.test.js`, `tests/assistencia-demo-entry.test.js`, `tests/barbearia-demo-entry.test.js`, `tests/beleza-demo-entry.test.js`, `tests/gastro-demo-entry.test.js`
- `.Agent/REGISTROS/2026-11-11-1438-antigravity-padronizacao-landing-pages.md`

### Modificados

- As 10 landing pages de venda em `produtos/`: `gestao-salas.html`, `gestao-odonto.html`, `gestao-fit.html`, `gestao-lavarapido.html`, `gestao-pdv.html`, `gestao-sorveteria.html`, `assistencia-pro.html`, `barbearia-premium.html`, `beleza-spa.html`, `gestao-gastro.html`.
- `produtos/assets/gestao-salas.css` e `produtos/assets/gestao-salas.js` (criados previamente na sessão DeepSeek; refinados para o padrão final com fotografia real e capturas em perspectiva).
- Camada de inicialização, banner e rotas das 10 demos (somente para viabilizar entrada contextual `?view=`, coerência inicial da tela e layout do banner):
  - `tecnologia/demos/gestao-salas/{index.html,demo-bypass.js,sw.js}`
  - `tecnologia/demos/gestao-odonto/{index.html,demo-bypass.js,sw.js}`
  - `tecnologia/demos/gestao-fit/{index.html,demo-bypass.js,sw.js}`
  - `tecnologia/demos/gestao-lavarapido/{index.html,demo-bypass.js,sw.js}`
  - `tecnologia/demos/gestao-pdv/{index.html,demo-bypass.js,sw.js}`
  - `tecnologia/demos/gestao-sorveteria/{index.html,demo-bypass.js,sw.js,assets/js/app.js,assets/js/theme.js}`
  - `tecnologia/demos/gestao-assistencia/{index.html,demo-bypass.js,sw.js,assets/js/router.js}`
  - `tecnologia/demos/gestao-barbearia/{index.html,demo-bypass.js,sw.js}`
  - `tecnologia/demos/gestao-beleza/{index.html,demo-bypass.js,sw.js}`
  - `tecnologia/demos/gestao-restaurantes/{index.html,demo-bypass.js}`

### Preservados fora de escopo (pré-existentes no repositório)

- `produtos/gestao-terapia.html`, `produtos/assets/gestao-terapia.{css,js}`, `produtos/assets/logo.png`, `assets/images/terapia/`, `tecnologia/demos/gestao-terapia/` (intocados).
- Alterações pré-existentes de sessões anteriores em `produtos/assets/produtos.css`, `servicos/servicos.html`, `tecnologia/tecnologia.html`, `tecnologia/demos/gestao-odonto/assets/js/demo-seed.js`, `tecnologia/demos/gestao-sorveteria/assets/js/demo-seed.js`, `produtos/PADRAO-LANDING-PAGES.md`, registros `.Agent/REGISTROS/2026-11-*` anteriores e `scratch_chrome_profile/`.

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `node --test tests\*-demo-entry.test.js` | `10` arquivos executados, `13` testes aprovados, `0` falhas (`307.5ms`) |
| `node --check` em todos `produtos/assets/*.js`, `demo-entry.js`, `demo-bypass.js` e scripts editados das demos (`router.js`, `app.js`, `theme.js`) | Código de saída `0` em todos os arquivos |
| `git diff --check` | Código de saída `0` sem conflitos ou erros de whitespace |
| Validação automatizada em navegador real (Chrome CDP — `validate-page.mjs`) nas 10 páginas trabalhadas em `1440px`, `768px`, `375px` e `320px` + revalidação pós-ajuste de `gestao-lavarapido`, `gestao-pdv`, `gestao-sorveteria`, `assistencia-pro` e `barbearia-premium` | `0` erros de console/página, `0` imagens quebradas, `0` ícones Lucide não hidratados, `h1Count = 1`, ausência de rolagem horizontal em `1440/768/375/320`, alinhamento exato à navbar (`diff = 0px` nas seções direita/esquerda), `beforeBackdrop: "none"`, FAQ, menu móvel, abertura genérica da demo, abertura contextual de todas as rotas `?view=`, tecla `Escape` e retorno de foco validados |
| Inspeção visual direta de capturas desktop hero, desktop página inteira e mobile `375px` das 10 páginas | Concluída e aprovada em todas as 10 páginas |
| Servidor local `http://127.0.0.1:8080/produtos/<sistema>.html` | HTTP `200` verificado nas 10 páginas padronizadas + `gestao-terapia.html` |

## Ajustes fora do escopo

- Nenhum; alterações pré-existentes no working tree foram integralmente preservadas.

## Pendências e riscos

1. **Bundle pré-compilado em `tecnologia/demos/gestao-restaurantes/`**: o arquivo `tecnologia/demos/gestao-restaurantes/sw.js` foi mantido intacto e referencia hashes antigos de precache que não correspondem ao chunk atual `assets/index-fK_TXwLo.js`; a demonstração ao vivo é protegida porque `demo-bypass.js` desregistra Service Workers no carregamento, porém um futuro rebuild Vite deve regenerar o `sw.js`.
2. **Temporizador estático do KDS em `gestao-restaurantes`**: os pedidos de exemplo na rota `Cozinha` (`?view=cozinha`) estão fixados no bundle compilado `assets/index-fK_TXwLo.js` com datas de `2026-07-14`, gerando contadores altos de tempo decorrido frente à data atual (`2026-11-11`). Seguindo a diretriz de não editar builds compilados, mantivemos o bundle intacto e selecionamos `PDV Balcão`, `Mesas` e `Estoque` para as capturas principais da vitrine.
3. **Working tree pré-existente**: há modificações anteriores no repositório (`produtos/assets/produtos.css`, `servicos/servicos.html`, `tecnologia/tecnologia.html`, `demo-seed.js` de Odonto/Sorveteria e `scratch_chrome_profile/`) aguardando revisão consolidada do responsável.

## Estado final

- Status: `Concluído (aguardando validação final do responsável)`
- Servidor local de prévia: `Ativo em http://127.0.0.1:8080/`
- Commit: `Não realizado (conforme instrução)`
- Push: `Não realizado (conforme instrução)`
