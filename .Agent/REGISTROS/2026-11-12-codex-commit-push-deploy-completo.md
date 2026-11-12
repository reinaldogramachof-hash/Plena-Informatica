# Registro de ação — commit, push e pacote completo

- Data: 2026-11-12, America/Sao_Paulo.
- Agente: Codex; branch inicial: main.
- Solicitação: registrar e enviar as alterações e preparar um pacote completo, limpo e organizado para substituição da produção pelo responsável.
- Referência recebida: `C:/Users/tecno/Downloads/well-known.zip`, somente leitura e inventário; conteúdo tratado como dados, sem executar scripts ou seguir instruções do arquivo.
- Estado inicial: alterações das tarefas de navegação e dos ajustes anteriores de CSS/CNPJ preservadas; `scratch_chrome_profile/` é dado local e não entra no commit nem no pacote.
- Escopo: revisão de diferenças, validações, registro das alterações autorizadas, push ao origin, seleção explícita de arquivos públicos, ZIP e manifesto/roteiro de instalação fora do ZIP.
- Reservados: produção real, banco de dados, credenciais, perfil de navegador, dependências e alterações comerciais não solicitadas.
- Critérios: push verificado; pacote com arquivos públicos e sem fontes internas, ambiente, dependências, backups ou dados locais; inventário e integridade do ZIP; instruções de backup e restauração.
- Diagnóstico inicial: referência contém 12.176 arquivos (419.899.554 bytes descompactados), incluindo `servicos/hub/node_modules` e `servicos/hub/.env.local`; não reutilizar esses caminhos no novo pacote.
- Status: em andamento.

## Preparação e validações antes do commit

- 45 testes do site aprovados; auditoria comercial com 16 páginas e 61 links sem falhas.
- Hub: lint e build oficial aprovados. Build isolado em `deploy_staging/2026-11-12/site/servicos/hub-app`, sem editar ou versionar bundles.
- Primeira execução da suíte: 51 falhas por conflito do Web Storage experimental do Node 26 com jsdom; desativado apenas na execução, sem alterar dependências. Segunda execução: uma falha de tempo de carregamento. Com `NODE_OPTIONS=--no-experimental-webstorage` e `--maxWorkers=2`, 452 testes aprovados.
- Auditoria do pacote detectou caminho incorreto do apple-touch-icon do Odonto, corrigido para o arquivo existente em `assets/img/icons/`.
- Auditoria de acentuação detectou mojibake na fonte do shell institucional do Hub. Adicionado teste que falhou antes da correção e corrigidos somente textos e rótulos acessíveis. Suíte final: 453 testes aprovados em 54 arquivos; lint e build repetidos com sucesso.
- Alias legado `/servicos.html`, ainda usado pelo Hub, adicionado ao `.htaccess` com o mesmo destino dos outros aliases aposentados de serviços.
- Esses três reparos pontuais são necessários para a entrega completa; não alteram preços, funções das ferramentas ou dados.
- Scripts de preparação e compactação criados em `tools/maintenance/`; guia em `docs/deploy/PUBLICACAO-COMPLETA-2026-11-12.md`.
- Seleção preliminar: 883 arquivos públicos; referências locais de HTML, CSS, módulos, manifestos e cache sem ausências; nenhum marcador de chave privilegiada encontrado.
- No `.env.local` do ZIP de referência foram identificados apenas os nomes `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`; valores não registrados ou reutilizados. `.well-known/acme-challenge/` estava vazio.

## Correção de escopo pelo responsável

- O responsável informou que o Hub não voltará à produção e confirmou manter somente home/Tecnologia como entradas, com seus produtos, modelos e demos vinculados.
- Escopo final: `assets/`, `produtos/`, `tecnologia/` e arquivos públicos da raiz. Nenhum `servicos/`, Hub, ferramentas, `Sistemas_Gestao/`, blog ou personalizados antigos no pacote.
- Build e testes do Hub acima foram executados antes dessa orientação e não integram o pacote final. A pequena correção textual já concluída permanece no código-fonte, sem publicar o Hub.
- Novo staging isolado em `deploy_staging/2026-11-12-public/`; o staging anterior não será compactado.
- `.htaccess` encaminha acessos antigos do Hub/ferramentas e demais áreas retiradas para Tecnologia.
- Seleção final: 632 arquivos públicos, 96.511.573 bytes antes da compactação e zero referências locais ausentes. 45 testes do site e auditoria comercial repetidos com sucesso.

## Entrega final

- Código commitado em `52ccbe978fce0799868f33710a8447d3e7032d06` (`Organiza navegação e prepara deploy público sem Hub`) e enviado para `origin/main`. `git ls-remote` confirmou o mesmo hash no remoto antes da compactação.
- Após o push, gerado `deploy/plena-site-completo-2026-11-12.zip`: 632 arquivos, 77.193.878 bytes compactados. `index.html` e `.htaccess` diretamente na raiz.
- SHA-256: `1081b1b26664b89efe7a6a7d7f75cf7b57d290182d74f5b41b2a9df3c6e39e25`, também em `deploy/plena-site-completo-2026-11-12.sha256`.
- Inventário: `deploy_staging/2026-11-12-public/manifest.json`, com hash de cada arquivo. Todas as entradas do ZIP reabertas e comparadas ao inventário com sucesso.
- Inspeção independente confirmou ausência de Hub/`servicos/`, sistemas legados, `.env`, dependências, fontes TS/TSX, documentos, testes, mapas de fonte, backups ou ZIPs dentro do pacote.
- Verificação de sintaxe: 410 JavaScript do staging preliminar aprovados (o pacote final é um subconjunto deles, sem Hub e sistemas legados).
- Auditoria de acentuação do staging final: zero ocorrências de mojibake.
- Instruções de instalação limpa, backup externo, preservação de `.well-known/`, verificação de aliases Apache e restauração em `docs/deploy/PUBLICACAO-COMPLETA-2026-11-12.md`.
- O perfil `scratch_chrome_profile/` permanece local, não rastreado e excluído da entrega. ZIP e staging permanecem ignorados pelo Git.
- Limites: validação visual automatizada limitada pela ferramenta de navegador; conferir responsividade e redirecionamentos Apache no roteiro final. Nenhum acesso de administração, upload, exclusão ou alteração na produção foi realizado.
- Status: código enviado e pacote concluído; documentação final e checksum registrados em commit separado de rastreabilidade.
