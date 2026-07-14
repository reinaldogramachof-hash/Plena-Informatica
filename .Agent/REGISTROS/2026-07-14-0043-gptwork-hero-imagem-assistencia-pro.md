# Registro de ação — Hero com fachada do Assistência Pro

- Data: 2026-07-14 00:43
- Agente: GPT Work / Codex

## Objetivo

Aplicar a imagem `heroassistencia.png` ao hero do Gestão Assistência Pro, reduzir a carga de texto inicial e destacar a demonstração do sistema e o teste gratuito de 7 dias.

## Arquivos modificados

- `produtos/assistencia-pro.html`
- `produtos/assets/produtos.css`
- `.Agent/REGISTROS/2026-07-14-0043-gptwork-hero-imagem-assistencia-pro.md`

## Mudanças aplicadas

- O hero passou a usar a fachada `heroassistencia.png` em tela cheia, com contraste adaptado para preservar a leitura.
- A mensagem inicial foi reduzida e o nome `Gestão Assistência Pro` passou a ser o título principal.
- Os CTAs do hero foram definidos como `Abrir Demo do Sistema` e `Solicitar teste gratuito de 7 dias`.
- O painel `Demo interativa liberada`, que ficava logo abaixo do hero, foi removido conforme orientação posterior do responsável.
- O atalho `Interface` foi retirado das navegações desktop e móvel para não manter uma âncora sem destino.
- O modal de demo e o encaminhamento móvel pelo WhatsApp permanecem associados ao CTA de demo do hero.

## Validações executadas

- Confirmada a existência de `heroassistencia.png` na raiz e sua referência relativa no CSS.
- Confirmado que a seção removida e a âncora `#interface` não permanecem na landing.
- Confirmados os dois CTAs principais e a chamada de demo existente.
- Auditoria de âncoras locais, mojibake e placeholders: sem falhas.
- `git diff --check -- produtos/assistencia-pro.html produtos/assets/produtos.css`: sem erros.

## Pendências e riscos

- A validação visual final será realizada pelo responsável, conforme orientação.
- `heroassistencia.png` é um arquivo novo não rastreado no diretório de trabalho e foi preservado, sem ser modificado por esta ação.

## Git

Não houve commit nem push.
