# Manifesto do pacote publico limpo

Pacote: `plena-site-completo-organizado-2026-08-12.zip`

Data: 12/08/2026

Origem: `deploy/_public-full-clean-2026-08-12`

Resumo:

- Arquivos no staging: 501.
- Tamanho do staging: 54,2 MB.
- Tamanho do ZIP: 43,06 MB.
- `.htaccess`: incluido.
- WhatsApp padronizado: `5512992191018` / `(12) 99219-1018`.

Conteudo publico incluido:

- raiz institucional: `index.html`, `style.css`, `script.js`, `.htaccess`,
  `robots.txt`, `sitemap.xml`, `limpar-cache.html` e imagens publicas usadas
  pelas paginas;
- `blog/`;
- `produtos/`;
- `servicos/servicos.html`, `servicos/script.js`, `servicos/style.css`,
  `servicos/imagens/`, `servicos/hub-app/` e redirecionamento legado em
  `servicos/ferramentas/qr-code/`;
- `tecnologia/` completa;
- `Sistemas_Gestao/`.

Conteudo propositalmente excluido:

- arquivos de agente, Git, docs, testes, relatórios internos, zips antigos,
  stagings, scripts locais e codigo-fonte `servicos/hub/`.

Validacoes:

- Links internos do staging: aprovados, sem referencias quebradas.
- Rotas locais essenciais: status 200.
- Scripts publicos principais: `node --check` aprovado.
- Telefone antigo: nao encontrado no staging.
- Mojibake visivel: nao encontrado apos limpeza.

Roteiro recomendado de upload:

1. Fazer backup completo do `public_html`.
2. Mover o conteudo atual do `public_html` para uma pasta de backup datada.
3. Extrair este ZIP diretamente na raiz do `public_html`.
4. Conferir:
   - `/tecnologia/tecnologia.html`
   - `/tecnologia/sites-premium/index.html`
   - `/tecnologia/sites-premium/advocacia/index.html`
   - `/tecnologia/landing-pages/index.html`
   - `/tecnologia/ecommerce/index.html`
   - `/servicos/hub-app/`
5. Depois de validar, limpar do servidor qualquer arquivo antigo que nao exista
   neste pacote.
