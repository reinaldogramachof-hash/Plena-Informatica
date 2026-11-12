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
