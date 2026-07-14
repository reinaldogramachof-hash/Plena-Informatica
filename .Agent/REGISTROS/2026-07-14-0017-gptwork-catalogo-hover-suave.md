# Registro de ação — Catálogo comercial com hover suave

- Data: 2026-07-14 00:17
- Agente: GPT Work / Codex

## Objetivo

Remover o brilho visual do fundo do Catálogo comercial e tornar a interação de hover dos cards mais discreta.

## Arquivo modificado

- `tecnologia/style.css`

## Mudanças aplicadas

- Removida a animação de varredura/brilho do fundo da seção `.tech-showcase`.
- Removido o halo dourado que acompanhava o cursor dentro dos cards.
- Substituído o efeito de inclinação 3D por uma elevação curta de 3 px, sombra suave e transição de 240 ms.
- Suavizada a alteração de fundo e neutralizada a iluminação forte dos ícones no hover.

## Validações executadas

- Navegador local em 1440 px: seção sem animação de fundo, cards sem overlay de brilho e sem overflow horizontal.
- Inspeção de estilos no navegador: transição dos cards confirmada como `0.24s ease-out`.
- Busca estática: `bgShimmer`, overlay de card e variáveis de brilho do cursor não permanecem no CSS.
- `git diff --check -- tecnologia/style.css`: sem erros.

## Git

Não houve commit nem push.
