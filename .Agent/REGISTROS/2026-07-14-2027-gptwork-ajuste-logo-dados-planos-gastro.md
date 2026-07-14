# Registro de ação

## Identificação

- Data: `2026-07-14`
- Horário e fuso: `20:27 America/Sao_Paulo`
- Agente: GPT Work
- Pacote ou tarefa: ajuste de logo, dados demonstrativos e planos do Gestão Gastro
- Solicitação de origem: remover imagem quebrada, enriquecer a interação da demo e ajustar planos.
- Branch: `main`

## Ações realizadas

1. A camada da demo substitui o `favicon.png` ausente no cabeçalho interno por um ícone SVG de talheres, removendo a imagem quebrada.
2. Adicionei preenchimento visual de métricas e indicadores simulados no dashboard, preservando o build original do aplicativo.
3. Mantive roteiro contextual por módulo e o modo demonstração sem o painel Master.
4. Resumi os benefícios de cada plano em três pontos comerciais para equilibrar visualmente os quatro cards e atualizei a mensagem de orientação da seção.
5. Versionei novamente a camada externa da demo para evitar cache de versões anteriores.

## Arquivos

### Modificados

- `produtos/gestao-gastro.html`
- `tecnologia/demos/gestao-restaurantes/demo-bypass.js`
- `tecnologia/demos/gestao-restaurantes/index.html`

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `node --check tecnologia/demos/gestao-restaurantes/demo-bypass.js` | Sem erros de sintaxe. |
| HTTP `demo-bypass.js?v=4` | `200` |
| HTTP landing Gestão Gastro | `200` |
| Busca de mojibake | Nenhuma ocorrência nos arquivos alterados. |
| `git diff --check` no escopo | Sem erros. |

## Pendências e riscos

- Os dados preenchidos são uma camada visual de demonstração no dashboard. A persistência e os fluxos internos dependem do código-fonte do aplicativo, indisponível neste repositório; os bundles não foram editados.
- Validação visual local permanece pendente.

## Estado final

- Status: implementado localmente, aguardando validação visual.
- Commit: não realizado.
- Push: não realizado.
