# Registro de ação — retirada do retorno flutuante e dos portais intermediários

- Data: 2026-11-12, America/Sao_Paulo.
- Agente: Codex; branch: main.
- Origem: responsável solicitou retirar o novo botão de retorno para não atrapalhar a navegação, mantendo os caminhos corretos e os portais antigos removidos.
- Escopo: remover os botões flutuantes adicionados na tarefa anterior; manter retorno integrado aos modelos; aposentar o portal premium e corrigir aliases antigos, links internos e sitemap.
- Arquivos reservados: alterações preexistentes, lógica das demos de gestão, preços, dependências, Hub e publicação.
- Estado inicial: alterações da sessão anterior e de outros agentes preservadas; verificação identificou que o portal premium ainda estava disponível.
- Critérios: nenhum botão flutuante de origem; retorno nativo/rodapé correto; modelos continuam diretos; portais antigos conduzem ao catálogo.
- Status: concluído em código local; sem publicação.

## Entrega e arquivos

- Removidos os 44 retornos flutuantes adicionados na tarefa anterior e seu CSS de posicionamento.
- Mantidos os retornos existentes dos seis modelos premium, já corrigidos; nos 22 modelos de landing pages e e-commerce sem retorno nativo, link simples ao fim da página, em fluxo normal.
- Os 11 sistemas usam links nativos de menu/rodapé com rótulo curto e destino conforme origem, sem novo componente flutuante.
- Portal `tecnologia/sites-premium/index.html` substituído por encaminhamento ao catálogo, com fallback HTML para o servidor estático e preservação restrita da origem via JavaScript.
- `.htaccess`: portais premium, landing pages e e-commerce apontam diretamente às categorias; padrões exatos preservam os modelos individuais.
- Atualizados 25 links internos de portais para o catálogo, retirados os dois atalhos opcionais ao portal recém-adicionados e removida a URL aposentada do sitemap. Home e Tecnologia com `lastmod` da alteração.
- Arquivos: HTMLs já envolvidos no pacote anterior; `assets/catalog-navigation.js`, `assets/catalog-navigation.css`, `tests/catalog-navigation.test.js`, `.htaccess`, `sitemap.xml` e registros de decisão/feedback.

## Verificações

- TDD: antes da remoção, dois testes falharam demonstrando a presença do flutuante e do portal.
- `node --test tests/*.test.js`: 45 aprovados, zero falhas; inclui os 28 modelos, ausência do flutuante nesses modelos, aliases, encaminhamento local seguro e retorno compacto nativo.
- `node tools/local/audit-commercial-seo.mjs`: 16 páginas comerciais e 61 links, zero falhas.
- `node --check assets/catalog-navigation.js`: aprovado.
- `git diff --check`: aprovado, apenas avisos de normalização CRLF/LF em dois arquivos anteriores.
- Busca em home, produtos e Tecnologia: nenhuma ocorrência de `class="plena-return"` ou `Voltar ao portal` (rg retorna 1 quando não encontra ocorrências).

## Limites e handoff

- Validação visual automatizada não retomada; permanece a limitação da ferramenta de navegador registrada na tarefa anterior.
- Redirecionamentos HTTP do `.htaccess` precisam ser conferidos em Apache após publicação autorizada; o servidor estático local usa o fallback HTML do portal premium.
- Roteiro local: abrir home ou Tecnologia, entrar em um modelo e usar o link nativo/rodapé; confirmar que não existe botão de origem sobre o conteúdo. Acessar `/tecnologia/sites-premium/` e conferir o encaminhamento ao catálogo.
- Ajustes fora do escopo: nenhum. Código das demos, dados e alterações preexistentes preservados.
- Commit, push, pacote final de deploy e publicação: não realizados nesta etapa.
