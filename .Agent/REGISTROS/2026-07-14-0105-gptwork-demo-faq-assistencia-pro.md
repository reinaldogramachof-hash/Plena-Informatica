# Registro de ação — Modos de demo e FAQ do Gestão Assistência Pro

- Data: 2026-07-14 01:05
- Agente: GPT Work / Codex

## Objetivo

Inverter o tamanho de abertura da demo do Gestão Assistência Pro entre a página Tecnologia e a landing do produto, além de aprimorar a experiência visual do FAQ.

## Arquivos modificados

- `tecnologia/tecnologia.html`
- `tecnologia/script.js`
- `tecnologia/style.css`
- `produtos/assistencia-pro.html`
- `produtos/assets/produtos.js`
- `produtos/assets/produtos.css`
- `.Agent/REGISTROS/2026-07-14-0105-gptwork-demo-faq-assistencia-pro.md`

## Mudanças aplicadas

- O CTA de demo do card Assistência Pro na página Tecnologia passou a solicitar o formato compacto, sem alterar as demais demos do catálogo.
- O modal da Tecnologia agora possui uma estrutura interna que suporta os dois tamanhos: tela cheia como padrão e cartão compacto apenas quando solicitado.
- A landing do Gestão Assistência Pro passou a abrir a mesma demo em tela cheia, inclusive em telas menores, por meio de configuração específica da página.
- Atualizado o FAQ para refletir a abertura da demo em tela cheia.
- Refinado o FAQ com introdução, numeração das perguntas, cartões claros, ícone de expansão, estados de abertura, foco visível e ajustes mobile.

## Validações executadas

- `node --check tecnologia/script.js`: sem erros.
- `node --check produtos/assets/produtos.js`: sem erros.
- Validação estrutural dos dois HTMLs com parser: sem tags abertas ou fechamentos inconsistentes.
- `git diff --check` nos seis arquivos de implementação: sem erros.

## Pendências e riscos

- A validação visual automatizada não foi executada porque o navegador deste ambiente bloqueia o acesso direto ao arquivo local. A revisão visual final permanece com o usuário, conforme combinado.

## Git

Não houve commit nem push.
