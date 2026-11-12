# Registro de ação — navegação dos modelos

- Data: 2026-11-12, America/Sao_Paulo.
- Agente: Codex; branch: main.
- Solicitação: revisar o acesso aos modelos pela Tecnologia e pela home, com retorno visível e dirigido à origem.
- Estado inicial: alterações preexistentes nos cinco arquivos e itens não rastreados listados no registro de início da sessão; preservar integralmente.
- Escopo: navegação em `index.html`, catálogo e páginas comerciais/modelos de Tecnologia, páginas de produto vinculadas, assets compartilhados de navegação e testes relacionados.
- Reservados: lógica das demos de gestão, Hub, dados, preços, dependências e publicação.
- Critérios: modelos acessíveis diretamente pelo catálogo; atalhos de categoria na home; retorno explícito à home ou à categoria de Tecnologia conforme origem; fallback seguro em acesso direto; teclado e larguras pequenas.
- Plano: testes de regressão antes da implementação; adaptar os links existentes sem substituir páginas; validar testes, referências, sintaxe e percursos no navegador.
- Status: implementado localmente; aguardando validação visual do responsável.

## Objetivo entregue e comportamento

- Home com atalhos diretos para Sites Premium, Landing Pages e lojas virtuais no catálogo; card de sites também abre os modelos diretamente.
- Os 28 modelos do catálogo mantêm links diretos, sem passagem obrigatória pelo portal comercial; landing pages e e-commerce passam a abrir na mesma aba.
- Retorno fixo e visível nos modelos, páginas comerciais e 11 páginas de sistemas. Links antigos de retorno ao portal premium foram substituídos por retorno ao catálogo.
- Origem preservada por `origem=inicio|tecnologia`, sem storage ou requisições externas: percursos iniciados na home voltam a `/index.html#services`; entrada por Tecnologia ou acesso direto a modelos volta à categoria correspondente.
- Tecnologia mantém retorno à home. As abas registram a categoria na URL, restauram seleção por deep link e respondem a `hashchange`.
- Páginas comerciais preservadas, incluindo acesso opcional ao planejamento de sites e landing pages nas respectivas categorias.
- Metadados, preços, lógica das demos e mudanças anteriores preservados. A diferença de CNPJ no diff de Tecnologia já existia antes desta tarefa.

## Arquivos criados

- `assets/catalog-navigation.js`.
- `assets/catalog-navigation.css`.
- `tests/catalog-navigation.test.js`.
- Este registro.

## Arquivos modificados

- `index.html` e `tecnologia/script.js`.
- `tecnologia/tecnologia.html`: integração pontual sobre a alteração preexistente.
- 28 HTMLs dos modelos vinculados pelo catálogo: seis premium, 12 landing pages e dez e-commerce.
- 11 HTMLs de sistemas em `produtos/`: somente importações de navegação e link de retorno.
- `tecnologia/sites-premium/index.html`, `tecnologia/ecommerce.html`, `tecnologia/automacoes.html` e `tecnologia/sites-para-psicologos.html`: importações e retorno.
- `.Agent/REGISTROS/DECISOES.md`: direção de navegação solicitada pelo responsável.

## Testes e verificações

- TDD: teste inicial falhou por ausência do módulo; teste de sincronização de abas falhou por hash não atualizado antes da correção.
- Nove testes novos: origem, acesso direto, fallback por categoria, rejeição de origem externa/inválida, preservação de query/hash, integração dos 28 modelos, atalhos da home e sincronização das abas.
- `node --test tests/*.test.js`: 42 testes aprovados, zero falhas.
- `node tools/local/audit-commercial-seo.mjs`: 17 páginas comerciais, 62 links de navegação, zero falhas. A primeira execução identificou âncora de categoria ausente; adicionadas âncoras reais às seis categorias e repetida a auditoria com sucesso.
- `node --check assets/catalog-navigation.js` e `node --check tecnologia/script.js`: aprovados.
- Checagem HTTP local: 32 URLs, incluindo todos os modelos e ambos os novos assets, todas com status 200.
- `git diff --check`: aprovado; avisos de normalização CRLF/LF em dois HTMLs existentes, sem erros de whitespace.
- Hub não alterado; build e suíte do Hub não se aplicam a este pacote estático.

## Pendências e limites

- A validação visual não foi concluída: o navegador integrado não anexou o webview; a tentativa de usar o Edge pela ferramenta de computador foi interrompida porque ela não conseguiu determinar a URL atual com confiança suficiente para aplicar sua política. Nenhuma tentativa de contornar a restrição foi realizada.
- Conferir desktop, 768, 375 e 320 px, teclado/foco e posicionamento do retorno junto às barras próprias dos modelos antes de fechar o pacote de deploy.
- Sem alteração de `.htaccess`, publicação, commit ou push.
- Ajustes fora do escopo: nenhum.

## Roteiro de teste local

1. Abrir `http://127.0.0.1:8080/index.html#services`, escolher uma categoria de modelos, abrir um modelo e conferir retorno à página inicial.
2. Abrir Tecnologia diretamente, escolher categoria e modelo; conferir retorno à mesma categoria.
3. Recarregar o modelo e repetir o retorno; abrir um modelo diretamente sem query e conferir fallback para Tecnologia.
4. Testar navegação pelo teclado e tamanhos pequenos; observar a legibilidade e eventual sobreposição do botão flutuante.
