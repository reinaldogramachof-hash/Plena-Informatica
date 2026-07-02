# Registro de ação — reconstrução de `tecnologia/tecnologia.html`

- Data: 2026-07-01
- Horário: 19:35
- Agente: Codex
- Tipo de ação: recuperação estrutural de arquivo corrompido no worktree

## Causa raiz

- O problema não foi decisão de design nem ajuste editorial.
- Um edit malformado no worktree substituiu parte do bloco `tab-gestão` por um trecho de `<head>` e `<header>`, cortando o fechamento do card `Gestão Gastro`, apagando o card `Beleza & Spa`, removendo o `</div>` de fechamento da grade e duplicando bootstrap de página no meio do documento.
- Esse mesmo trecho duplicado reintroduziu carregamento duplicado de `script.js`, gerando erro de JavaScript por redeclaração e quebrando modal/menu dali em diante.

## Estratégia aplicada

- Reconstrução completa do arquivo a partir de `git show HEAD:tecnologia/tecnologia.html`.
- Reaplicadas apenas as mudanças legítimas de hoje:
  - trailing slash nas 4 demos de sistemas:
    - `demos/gestao-assistencia/`
    - `demos/gestao-barbearia/`
    - `demos/gestao-restaurantes/`
    - `demos/gestao-beleza/`
  - remoção das referências a `Personalizados` no nav, footer, tagline e menu mobile
  - remoção de `e produtos personalizados` do parágrafo legal

## Estrutura final confirmada

- `1` ocorrência de `<head>`
- `1` ocorrência de `</head>`
- `1` ocorrência de `<header>`
- `1` ocorrência de `</header>`
- `1` ocorrência de `<script src="script.js" defer></script>`
- grade `tab-gestão` fechando antes de `tab-landing`
- 4 cards de sistemas completos:
  - `Assistência Pro`
  - `Barbearia Premium`
  - `Gestão Gastro`
  - `Beleza & Spa`

## Contagem de linhas

- Base limpa lida de `HEAD` no momento da recuperação: `1275` linhas no output materializado localmente
- Arquivo final reconstruído: `1264` linhas

## Validações executadas

- checagem estrutural por script local:
  - contagem de `<head>`, `</head>`, `<header>`, `</header>` e `script.js`
  - confirmação do fechamento de `tab-gestão` antes de `tab-landing`
- `git diff --check -- tecnologia/tecnologia.html`
- `rg -n -i "personalizados" tecnologia/tecnologia.html`
- validação local em `http://127.0.0.1:4173/tecnologia/tecnologia.html`

## Resultado funcional confirmado

- zero erros no console, incluindo ausência de `already been declared`
- 4 cards de sistemas visíveis
- menu hambúrguer funcionando em mobile
- modal de demo abrindo e fechando normalmente para os 4 sistemas
- `personalizados` no arquivo final: `0` ocorrências
