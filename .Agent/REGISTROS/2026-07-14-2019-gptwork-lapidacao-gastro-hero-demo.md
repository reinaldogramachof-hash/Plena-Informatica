# Registro de ação

## Identificação

- Data: `2026-07-14`
- Horário e fuso: `20:19 America/Sao_Paulo`
- Agente: GPT Work
- Pacote ou tarefa: lapidação visual e comercial do Gestão Gastro
- Solicitação de origem: padronizar rodapé, preço personalizado, hero e experiência da demo.
- Branch: `main`

## Escopo

- Objetivo: aplicar a hero fornecida, adicionar o plano personalizado, padronizar o rodapé e aprimorar a camada comercial da demo sem alterar o build compilado.
- Arquivos permitidos: `produtos/gestao-gastro.html`, `produtos/assets/produtos.css`, `tecnologia/demos/gestao-restaurantes/index.html` e novos arquivos estritamente necessários da demo.
- Arquivos reservados: `tecnologia/demos/gestao-restaurantes/assets/*`.

## Ações realizadas

1. Apliquei `herogastro.png` como imagem de fundo da hero, preservando contraste para os CTAs.
2. Adicionei o card de projeto personalizado por `R$ 4.999,90` e mantive os três planos mensais publicados.
3. O rodapé legado da página ficou oculto e foi substituído pelo rodapé conciso usado nas demais landings Gestão Pro.
4. Criei e apliquei o ícone SVG de Gestão Gastro à demo.
5. Incluí uma camada externa de demonstração: identifica o ambiente com dados simulados, exibe roteiro contextual por módulo e encaminha o CTA ao WhatsApp.
6. O caminho `/master` é redirecionado para a visão operacional e a entrada Master é ocultada após a interface carregar.

## Arquivos

### Criados

- `.Agent/REGISTROS/2026-07-14-2019-gptwork-lapidacao-gastro-hero-demo.md`
- `tecnologia/demos/gestao-restaurantes/demo-bypass.js`
- `tecnologia/demos/gestao-restaurantes/gastro-icon.svg`

### Modificados

- `produtos/gestao-gastro.html`
- `produtos/assets/produtos.css`
- `tecnologia/demos/gestao-restaurantes/index.html`

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| HTTP `/produtos/gestao-gastro.html` | `200` |
| HTTP `/herogastro.png` | `200` |
| HTTP `/tecnologia/demos/gestao-restaurantes/` | `200` |
| HTTP `demo-bypass.js` | `200` |
| HTTP `gastro-icon.svg` | `200` |
| Busca de mojibake | Nenhuma ocorrência encontrada nos arquivos alterados. |
| Busca de placeholders | Nenhuma ocorrência de `TODO`, `TBD`, `Depoimento de exemplo` ou `Nome do cliente`. |
| `git diff --check` no escopo | Sem erros. |

## Pendências e riscos

- A demo é fornecida apenas como bundle compilado. Não foi possível alterar a base de dados interna sem editar artefatos gerados ou chamar serviços externos; a camada aplicada apenas identifica e orienta o uso dos dados de demonstração já carregados pelo aplicativo.
- Validação visual desktop e mobile permanece pendente de aprovação local do responsável.

## Estado final

- Status: implementado localmente, aguardando validação visual.
- Commit: não realizado.
- Push: não realizado.
