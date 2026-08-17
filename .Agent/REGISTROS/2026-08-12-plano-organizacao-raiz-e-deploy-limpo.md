# Registro de acao - organizacao da raiz e pacote publico limpo

Data: 12/08/2026

## Objetivo

Recuperar o site apos o pacote que introduziu mojibake e quebrou acessos da
pagina de tecnologia, montando uma publicacao completa e organizada para novo
envio ao servidor.

## Decisao aplicada

Foi montado um staging publico separado em `deploy/_public-full-clean-2026-08-12`.
A raiz original do projeto nao foi reorganizada fisicamente nesta rodada para
nao mover arquivos usados por paginas existentes sem uma segunda validacao.

As imagens essenciais permaneceram na raiz do pacote publico porque hoje sao
referenciadas por `index.html`, `produtos/`, `servicos/` e `tecnologia/`.
Mover essas imagens agora exigiria troca coordenada de muitos caminhos e
aumentaria o risco de novo 404.

## Entra no pacote publico

- `index.html`, `style.css`, `script.js`, `.htaccess`, `robots.txt`,
  `sitemap.xml` e `limpar-cache.html`.
- Imagens publicas da raiz usadas pelas paginas.
- `blog/`.
- `produtos/`.
- `servicos/servicos.html`, `servicos/script.js`, `servicos/style.css`,
  `servicos/imagens/`, `servicos/hub-app/` e o redirecionamento legado
  `servicos/ferramentas/qr-code/`.
- `tecnologia/` completa, incluindo demos, modelos, sites premium, landing
  pages, e-commerce e projetos sob consulta.
- `Sistemas_Gestao/`.

## Fica fora do pacote publico

- `.Agent/`, `.agents/`, `.codex/`, `.claude/`, `.superpowers/` e `.git/`.
- `deploy/`, zips antigos, stagings e ferramentas temporarias.
- `docs/`, `tests/`, relatorios Markdown, handoffs e tabelas internas.
- `servicos/hub/`, `servicos/docs/` e `servicos/supabase/`.
- Scripts locais como `_run_servers.bat` e `__local-site-server.mjs`.

## Validacoes executadas

- Links publicos do staging: sem referencias quebradas.
- Rotas locais com status 200:
  - `tecnologia/tecnologia.html`
  - `tecnologia/sites-premium/index.html`
  - `tecnologia/sites-premium/advocacia/index.html`
  - `tecnologia/landing-pages/index.html`
  - `tecnologia/projetos-sob-consulta/index.html`
  - `tecnologia/ecommerce/index.html`
  - demos principais de assistencia, barbearia e restaurantes
  - paginas de produtos e `servicos/hub-app/`
- Scripts publicos principais aprovados em `node --check`.
- Telefone antigo `551299291018` nao aparece mais no staging.
- WhatsApp padronizado para `5512992191018` / `(12) 99219-1018`.

## Observacao sobre mojibake

A auditoria de acentuacao nao encontrou mojibake em paginas HTML/CSS/JS
visiveis apos a limpeza. Restou apenas ocorrencia de caractere de substituicao
em biblioteca empacotada de PDF (`servicos/hub-app/assets/es-BWEFQZvH.js`),
usada internamente como tabela de codificacao, sem texto publico visivel.

## Proxima etapa segura no servidor

1. Fazer backup completo do `public_html` atual.
2. Mover o conteudo atual do servidor para uma pasta de backup datada.
3. Extrair o pacote publico limpo na raiz do site.
4. Conferir as rotas de tecnologia e sites premium antes de remover o backup.
5. Somente depois, excluir do servidor arquivos soltos antigos que nao existam
   no manifesto do novo pacote.
