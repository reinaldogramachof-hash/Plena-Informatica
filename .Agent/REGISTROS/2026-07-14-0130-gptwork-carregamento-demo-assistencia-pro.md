# Registro de ação — Carregamento da demo do Gestão Assistência Pro

- Data: 2026-07-14 01:30
- Agente: GPT Work / Codex

## Objetivo

Corrigir a percepção de tela preta na abertura da demo interna em tela cheia da landing do Gestão Assistência Pro.

## Arquivos modificados

- `produtos/assistencia-pro.html`
- `produtos/assets/produtos.js`
- `produtos/assets/produtos.css`
- `.Agent/REGISTROS/2026-07-14-0130-gptwork-carregamento-demo-assistencia-pro.md`

## Mudanças aplicadas

- Incluído estado de carregamento claro enquanto a demo é aberta no iframe.
- Abertura agora reinicializa o destino da demo a cada acesso, evitando estado antigo ou cache inconsistente do iframe.
- Incluída opção de abrir a demo em nova aba quando o carregamento ultrapassa alguns segundos.
- Mantido o modal em tela cheia do Gestão Assistência Pro.

## Validações executadas

- Demo reproduzida por HTTP local a partir da landing do produto.
- Confirmados: CTA único, modal aberto, modo de tela cheia ativo, URL correta no iframe e loader ocultado após o carregamento.
- Captura visual confirmou a tela de demonstração carregada no modal.
- `git diff --check -- produtos/assistencia-pro.html produtos/assets/produtos.js produtos/assets/produtos.css`: sem erros.

## Git

Não houve commit nem push.
