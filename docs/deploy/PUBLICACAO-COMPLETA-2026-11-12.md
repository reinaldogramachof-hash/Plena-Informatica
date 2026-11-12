# Publicação completa — 12/11/2026

## Escopo final aprovado

Entradas principais: página inicial e página de Tecnologia. Manter seus destinos de produtos, modelos e demonstrações. Excluir Hub, ferramentas e áreas antigas.

- `deploy/plena-site-completo-2026-11-12.zip`: conteúdo público; `index.html` e `.htaccess` diretamente na raiz do ZIP.
- `deploy/plena-site-completo-2026-11-12.sha256`: checksum do ZIP.
- `deploy_staging/2026-11-12-public/manifest.json`: inventário com caminho, tamanho e SHA-256 de cada arquivo, commit de origem e auditoria de referências locais.

Inclui home, catálogo de Tecnologia, 11 páginas de sistemas, páginas de serviços específicos de Tecnologia, modelos, demos e assets necessários. Não inclui nenhuma pasta `servicos/`, Hub compilado ou código-fonte do Hub, nem `Sistemas_Gestao/`, personalizados ou blog antigos. Os sistemas demonstrativos atuais permanecem em `tecnologia/demos/`. A publicação não executa migrações nem altera bancos.

## Comparação com a produção recebida

O ZIP de referência continha 12.176 arquivos, incluindo dependências e `servicos/hub/.env.local`. Não extrair esse backup sobre a nova versão. O pacote novo não reutiliza fontes, dependências ou ambientes da produção. Os nomes de variáveis encontrados nesse ambiente eram URL e chave publicável do Supabase; valores não foram registrados.

Os portais premium, landing pages e e-commerce foram aposentados como páginas intermediárias; seus endereços antigos abrem as categorias de Tecnologia. Endereços antigos do Hub, ferramentas, personalizados e sistemas de referência também são encaminhados ao catálogo. Os modelos individuais continuam disponíveis.

## Substituição limpa no servidor

1. Baixar um backup atualizado de todo o `public_html`, incluindo arquivos ocultos. Guardá-lo fora da pasta pública e confirmar que abre. O ZIP de referência não é backup de banco remoto.
2. Confirmar no painel da hospedagem qual é a raiz do domínio. Limitar a substituição aos arquivos do site, sem mexer em e-mails, outros domínios, bancos ou configurações da conta.
3. Preservar `.well-known/` e eventuais arquivos de validação mantidos pela hospedagem. No ZIP recebido, `.well-known/acme-challenge/` estava vazio; o pacote novo não substitui essa pasta.
4. Mover a árvore antiga do site para um backup fora de `public_html`, em vez de apagar definitivamente. Retirar integralmente `servicos/`, dependências, ambientes, fontes, blog, personalizados, as árvores antigas `Sistemas_Gestao/` e a de nome corrompido, imagens soltas antigas e ZIPs históricos públicos. Não mesclar a árvore antiga com a nova.
5. Enviar e extrair o novo ZIP diretamente na raiz do domínio. Deve existir `public_html/index.html`, sem subpasta intermediária. Confirmar que `.htaccess` foi extraído.
6. Retirar o ZIP enviado da área pública após extrair. Manter guia, inventário e checksum fora de `public_html`.
7. Limpar cache da hospedagem/CDN, se utilizado, e validar em janela anônima. Demos instaladas como PWA podem conservar versões locais; não limpar o armazenamento dos usuários, pois pode conter dados. Conferir a versão de rede com um perfil de teste novo.

## Checklist após upload

- Home `/` e `/tecnologia/tecnologia.html`.
- Atalhos da home para Sites Premium, Landing Pages e lojas virtuais.
- Modelos das três categorias e seus retornos de menu ou rodapé, sem o novo botão flutuante.
- URLs antigas `/tecnologia/sites-premium/`, `/tecnologia/landing-pages/` e `/tecnologia/ecommerce/`: HTTP 301 para a categoria correspondente. O servidor estático local não interpreta `.htaccess`; conferir em Apache.
- Os 11 produtos, imagens dos módulos, demos e ações do WhatsApp.
- URLs antigas do Hub, ferramentas e áreas removidas: redirecionamento para Tecnologia; nenhum arquivo antigo deve ser servido.
- `robots.txt`, `sitemap.xml`, HTTPS e certificado.
- Desktop e celular: menu, foco por teclado, navegação e legibilidade.

## Restauração

Se houver falha relevante, retirar a nova árvore do diretório público e restaurar a anterior pelo backup externo, incluindo o `.htaccess` anterior. Preservar `.well-known/` e a configuração do domínio. Troca de arquivos não restaura nem desfaz dados de banco ou dados locais dos usuários.

## Reprodução local

Na raiz do checkout validado e commitado:

```powershell
node --test tests/*.test.js
node tools/local/audit-commercial-seo.mjs
./tools/maintenance/build-public-archive.ps1
```

O script PowerShell seleciona os arquivos do Git por lista permitida, verifica referências de HTML, CSS, módulos, manifestos/PWA e listas estáticas de cache; verifica marcadores de chaves privilegiadas, cria o ZIP e compara cada entrada com o hash do inventário. Recusa sobrescrever um ZIP existente e não publica. Usar staging novo para cada versão.

A conferência visual automatizada ficou limitada pela ferramenta de navegador nesta sessão; realizar o checklist final no servidor. Nenhum upload ou exclusão de produção foi executado pelo agente.
