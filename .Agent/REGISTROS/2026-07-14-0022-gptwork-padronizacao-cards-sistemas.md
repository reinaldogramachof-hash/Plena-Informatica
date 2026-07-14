# Registro de ação — Padronização dos cards de Sistemas de Gestão

- Data: 2026-07-14 00:22
- Agente: GPT Work / Codex

## Objetivo

Padronizar os quatro cards de amostra de Sistemas de Gestão no Catálogo comercial, melhorando a leitura e a consistência em desktop, tablet e celular.

## Arquivos modificados

- `tecnologia/tecnologia.html`
- `tecnologia/style.css`
- `.Agent/REGISTROS/2026-07-14-0022-gptwork-padronizacao-cards-sistemas.md`

## Mudanças aplicadas

- A aba Sistemas de Gestão passou a usar uma grade 2 × 2 em telas médias e grandes, sem cards em destaque de dimensões diferentes.
- Os quatro cards receberam a mesma estrutura: cabeçalho com ícone e metadados, resumo, descrição, preço e dois CTAs no rodapé.
- Foram removidas variações decorativas individuais que prejudicavam a uniformidade entre os sistemas.
- Preço, descrição e ações agora ocupam áreas equivalentes; em telas pequenas, os cards e CTAs empilham em uma coluna.
- Todos os atributos de rastreamento, links de produto e chamadas de demo foram preservados.

## Validações executadas

- Navegador local em 1440 px: grade com duas colunas de 628 px e quatro cards com 497 px de altura.
- Navegador local em 768 px: duas colunas de 344,4 px e quatro cards com 474 px de altura.
- Navegador local em 375 px e 320 px: uma coluna, CTAs empilhados e sem overflow horizontal.
- Verificação estática: quatro cards padronizados, CTAs de demo e páginas completas preservados, sem mojibake.
- `git diff --check -- tecnologia/tecnologia.html tecnologia/style.css`: sem erros.

## Git

Não houve commit nem push.
