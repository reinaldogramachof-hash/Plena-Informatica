# Registro de ação

## Identificação

- Data: `2026-07-14`
- Horário e fuso: `01:38 America/Sao_Paulo`
- Agente: GPT Work
- Pacote ou tarefa: dados simulados da demonstração Gestão Assistência
- Solicitação de origem: povoar o módulo de teste para tornar a visualização mais rica.

## Objetivo

Inserir dados exclusivamente fictícios na demonstração vazia, cobrindo os fluxos principais do sistema sem substituir dados que já tenham sido criados durante um teste.

## Arquivos modificados

- `tecnologia/demos/gestao-assistencia/demo-bypass.js`
- `.Agent/REGISTROS/2026-07-14-0138-gptwork-dados-simulados-demo-assistencia.md`

## Resumo das mudanças

- Adicionado preenchimento automático da base vazia com clientes, ordens de serviço em estados distintos, produtos, alertas de estoque, vendas no PDV, lançamentos financeiros, movimentações e caixa aberto.
- Datas são calculadas em relação ao dia atual para manter os indicadores mensais ativos.
- O preenchimento ocorre após a inicialização do sistema e atualiza as telas afetadas.
- Bases que já possuem dados não são modificadas.
- O botão `Resetar demo` volta a limpar a base e, após o recarregamento, reaplica os dados simulados.
- Corrigida a acentuação de `dados fictícios` na camada comercial da demonstração.

## Validações executadas

| Verificação | Resultado |
| --- | --- |
| `node --check tecnologia/demos/gestao-assistencia/demo-bypass.js` | Aprovado, sem erro de sintaxe. |
| Simulação isolada do navegador | A base vazia recebeu 4 O.S., 4 clientes, 6 produtos, 2 vendas no PDV e 4 lançamentos; uma base existente foi preservada. |
| Busca de mojibake no arquivo modificado | Sem ocorrências. |
| `git diff --check -- tecnologia/demos/gestao-assistencia/demo-bypass.js` | Aprovado. |
| `git status --short` | Conferido; alterações pré-existentes de outros trabalhos foram preservadas. |

## Pendências e riscos

- A validação visual local da demonstração permanece para o responsável, conforme o fluxo do projeto.
- O repositório já possuía diversas alterações fora deste pacote; elas não foram modificadas.

## Estado final

- Status: implementação concluída e validada de forma focada.
- Commit: não realizado.
- Push: não realizado.
