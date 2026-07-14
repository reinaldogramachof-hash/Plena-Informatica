# Registro de ação

## Identificação

- Data: `2026-07-14`
- Horário e fuso: `20:22 America/Sao_Paulo`
- Agente: GPT Work
- Pacote ou tarefa: correção da camada de demonstração Gestão Gastro
- Solicitação de origem: demo travando e ícone SVG não aplicado.
- Branch: `main`

## Ações realizadas

1. Corrigi o observador de alterações do roteiro contextual: ele reagia à própria atualização do card e podia criar um ciclo contínuo no navegador.
2. A atualização agora só ocorre quando o título do módulo muda e ignora alterações dentro do próprio roteiro.
3. Versionei o carregamento de `demo-bypass.js` para o navegador buscar a versão corrigida sem depender de cache.

## Arquivos

### Modificados

- `tecnologia/demos/gestao-restaurantes/demo-bypass.js`
- `tecnologia/demos/gestao-restaurantes/index.html`

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `node --check tecnologia/demos/gestao-restaurantes/demo-bypass.js` | Sem erros de sintaxe. |
| HTTP `demo-bypass.js?v=2` | `200` |
| HTTP da demo | `200` |
| `git diff --check` no escopo | Sem erros. |

## Estado final

- Status: correção aplicada localmente; aguarda nova validação visual.
- Commit: não realizado.
- Push: não realizado.
