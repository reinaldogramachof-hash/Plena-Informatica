# Registro de acao - redirects www e tecnologia antiga

Data: 2026-08-13

## Objetivo

Analisar os dois pontos observados pelo Claude e aplicar apenas os redirects
necessarios no mecanismo de hospedagem identificado no projeto.

## Arquivos modificados

- `.htaccess`

## Alteracoes realizadas

- Adicionada canonicalizacao 301 de `www.plenainformatica.com.br` para
  `plenainformatica.com.br`, preservando path e query string pelo Apache.
- Adicionado redirect 301 de `/tecnologia.html` para
  `/tecnologia/tecnologia.html`.
- Mantidas sem alteracao as metas, Open Graph, schema, canonical, robots e
  sitemap.

## Validacoes

- `.htaccess` revisado apos a alteracao.
- `git diff --check -- .htaccess` executado sem erros.

## Pendencias

- A validacao com `curl -I https://www.plenainformatica.com.br/` e
  `curl -I https://plenainformatica.com.br/tecnologia.html` so deve ser
  considerada conclusiva depois que o `.htaccess` atualizado for publicado no
  servidor.