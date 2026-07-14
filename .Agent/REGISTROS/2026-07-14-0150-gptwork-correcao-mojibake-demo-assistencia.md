# Registro de ação — Correção de acentuação da demo Gestão Assistência

- Data: 2026-07-14 01:50
- Agente: GPT Work / Codex

## Objetivo

Eliminar mojibake, caracteres de substituição e acentuações incorretas da interface visível da demo Gestão Assistência.

## Arquivos modificados

- `tecnologia/demos/gestao-assistencia/index.html`
- `.Agent/REGISTROS/2026-07-14-0150-gptwork-correcao-mojibake-demo-assistencia.md`

## Análise

- A auditoria localizou a corrupção concentrada no `index.html` da demo, especialmente em títulos, etiquetas, opções de status, manual, seção de backup e termos legais.
- Os módulos JavaScript da demo não apresentaram caracteres de substituição ou sequências de mojibake no conteúdo auditado.

## Mudanças aplicadas

- Corrigidas palavras como “Licença”, “Análise”, “Lançamento”, “Segurança”, “Ícone”, “começar”, “avança” e “lançado”.
- Corrigidas frases sobre backup, privacidade e termos de uso que exibiam o caractere de substituição.
- Removidos marcadores `?` e `??` remanescentes de ícones mal codificados; os rótulos permanecem claros sem depender desses símbolos.
- Corrigido o texto “Atenção necessária”.

## Validações executadas

- Auditoria recursiva da demo para caractere de substituição, máscara `??` e símbolo ordinal usado indevidamente: sem ocorrências.
- O parser HTML simples identificou estruturas preexistentes em torno de opções/datalist que não interpreta corretamente; não houve alteração estrutural, apenas textual, nessa área.
- `git diff --check -- tecnologia/demos/gestao-assistencia/index.html`: sem erros.

## Git

Não houve commit nem push.
