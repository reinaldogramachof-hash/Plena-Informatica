# Registro de ação — remoção da menção legal a Personalizados

- Data: 2026-07-01
- Horário: 18:45
- Agente: Codex
- Decisão aplicada: Versão A — remover a menção, sem manter cobertura legada.

## Arquivos confirmados

- `index.html`
- `blog/index.html`
- `servicos/servicos.html`
- `produtos/gestao-gastro.html`
- `tecnologia/tecnologia.html`

## Alteração executada

- Remoção literal de `e produtos personalizados` no parágrafo de termos/responsabilidade das 5 páginas acima.
- Preservado o restante da frase, a estrutura HTML e o trecho precedente com `2. Serviços.`.

## Validações executadas

- `rg -n -i "personalizados" index.html blog/index.html servicos/servicos.html produtos/gestao-gastro.html tecnologia/tecnologia.html`
- `git diff --check -- index.html blog/index.html servicos/servicos.html produtos/gestao-gastro.html tecnologia/tecnologia.html`

## Resultado

- Busca por `personalizados` nas 5 páginas: `0` ocorrências.
