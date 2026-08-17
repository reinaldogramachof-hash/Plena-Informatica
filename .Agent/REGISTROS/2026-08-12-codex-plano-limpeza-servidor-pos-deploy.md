# Plano de limpeza do servidor pos-deploy

- Data: `2026-08-12`
- Agente: Codex
- Base analisada: `C:\Users\reina\Downloads\well-known (2).zip`
- Pacote gerado: `deploy/plena-atualizacao-site-seo-whatsapp-2026-08-12.zip`
- Status: plano pronto; nenhuma limpeza remota executada.

## Objetivo

Publicar o pacote atualizado sem sobrescrever areas alheias do servidor e, em
seguida, limpar residuos que prejudicam manutencao, SEO ou podem manter assets
antigos em cache.

## Antes de subir o pacote

1. Fazer backup do servidor ou preservar o ZIP baixado como snapshot.
2. Confirmar que o numero oficial sera `551299291018`.
3. No servidor, limpar apenas:
   - `servicos/hub-app/assets/`
4. Subir o conteudo de `deploy/plena-atualizacao-site-seo-whatsapp-2026-08-12.zip`
   na raiz publica.

## Manter no servidor por enquanto

- `personalizados/`
- `Sistemas_Gestao/` ou pasta equivalente com nome acentuado/corrompido no ZIP.
- `.well-known/`
- imagens raiz usadas pelas paginas publicas.
- areas que existem no servidor mas nao existem neste checkout local.

## Remover somente apos nova confirmacao

- `servicos/hub/node_modules/`
- `servicos/hub/src/`
- ZIPs antigos na raiz, como `deploy-plena-atualizado-2026-07-31.zip`.
- backups antigos `*.bak.*`, se houver uma copia externa segura.
- bundles antigos em `servicos/ferramentas/qr-code/assets/`, caso a rota
  continue sendo apenas redirect para `servicos/hub-app/`.

## Validacoes apos subir

1. `https://www.plenainformatica.com.br/robots.txt` deve retornar o arquivo com
   `Sitemap: https://plenainformatica.com.br/sitemap.xml`.
2. `https://www.plenainformatica.com.br/sitemap.xml` deve retornar XML valido.
3. A home deve exibir `(12) 9929-1018`.
4. `servicos/servicos.html`, `tecnologia/tecnologia.html`, produtos e blog nao
   devem exibir telefones antigos.
5. O Hub em `servicos/hub-app/` deve carregar sem erro de asset.
6. Links principais de WhatsApp devem abrir com `phone=551299291018`.
7. A busca do Google pode demorar para refletir os novos dados; Google Meu
   Negocio precisa ser atualizado diretamente no painel.

## Criterio de sucesso

- Site publicado alinhado ao pacote local.
- `robots.txt` e `sitemap.xml` ativos.
- Telefones antigos ausentes das paginas publicas principais.
- Nenhuma pasta exclusiva do servidor removida sem confirmacao.
