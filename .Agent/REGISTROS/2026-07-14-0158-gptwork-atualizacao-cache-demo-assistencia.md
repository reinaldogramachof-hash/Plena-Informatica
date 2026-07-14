# Registro de ação — Atualização de cache da demo Gestão Assistência

- Data: 2026-07-14 01:58
- Agente: GPT Work / Codex

## Objetivo

Garantir que a demo Gestão Assistência carregue os textos e módulos corrigidos, sem reutilizar cópias antigas do cache da PWA.

## Arquivos modificados

- `tecnologia/demos/gestao-assistencia/sw.js`
- `produtos/assets/produtos.js`
- `.Agent/REGISTROS/2026-07-14-0158-gptwork-atualizacao-cache-demo-assistencia.md`

## Análise

- A auditoria atual não encontrou sequências de mojibake nos arquivos de interface ou módulos JavaScript da demo.
- A demo utiliza service worker com cache próprio. Uma versão antiga pode manter o `index.html` anterior e exibir textos já corrigidos como se ainda estivessem corrompidos.

## Mudanças aplicadas

- Atualizada a versão do cache da PWA de `v6` para `v7`.
- A abertura da demo pela landing agora inclui parâmetro de renovação na URL do iframe e no link de contingência, forçando a obtenção da versão atual.

## Validações executadas

- Auditoria recursiva da demo: sem caractere de substituição ou máscaras `??` em HTML, CSS, JavaScript e JSON fora de bibliotecas externas.
- `node --check produtos/assets/produtos.js`: sem erros.
- `git diff --check` nos arquivos alterados: sem erros.

## Git

Não houve commit nem push.
