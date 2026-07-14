# Registro de ação — Demo imersiva do Gestão Assistência Pro

- Data: 2026-07-14 01:40
- Agente: GPT Work / Codex

## Objetivo

Remover a abertura em nova aba da demo na página Tecnologia e tornar a demo da landing do Gestão Assistência Pro mais imersiva durante o teste.

## Arquivos modificados

- `tecnologia/tecnologia.html`
- `produtos/assistencia-pro.html`
- `produtos/assets/produtos.js`
- `produtos/assets/produtos.css`
- `.Agent/REGISTROS/2026-07-14-0140-gptwork-demo-imersiva-assistencia.md`

## Mudanças aplicadas

- Removido o atalho “Abrir em nova aba” do modal de demo da página Tecnologia.
- Na landing, o modo tela cheia não exibe mais a barra superior interna do modal; a demonstração ocupa toda a área útil.
- Adicionado botão flutuante de fechar, com foco visível, para preservar a saída acessível da demo imersiva.
- O bloqueio de rolagem passou a ser aplicado ao `body` e ao documento enquanto qualquer overlay estiver aberto.

## Validações executadas

- Confirmada a remoção do atalho de nova aba na estrutura da página Tecnologia.
- Confirmadas as regras de tela cheia sem cabeçalho interno, botão flutuante e bloqueio de rolagem global.
- `git diff --check` nos arquivos alterados: sem erros.

## Pendências e riscos

- A validação visual final em navegador permanece recomendada, especialmente para a altura total em diferentes navegadores e dispositivos.

## Git

Não houve commit nem push.
