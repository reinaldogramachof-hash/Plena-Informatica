# Registro de ação

## Identificação

- Data: `2026-07-14`
- Horário e fuso: `01:42 America/Sao_Paulo`
- Agente: GPT Work
- Pacote ou tarefa: roteiro rápido contextual da demonstração Gestão Assistência
- Solicitação de origem: apresentar orientações coerentes com o módulo aberto no teste.

## Objetivo

Manter um card discreto no canto inferior direito que apresente um roteiro curto e útil para o módulo selecionado na demonstração.

## Arquivos modificados

- `tecnologia/demos/gestao-assistencia/demo-bypass.js`
- `.Agent/REGISTROS/2026-07-14-0142-gptwork-roteiro-contextual-demo-assistencia.md`

## Resumo das mudanças

- O roteiro passou a reconhecer Dashboard, Ordens de Serviço, Clientes, PDV, Estoque, Fluxo de Caixa, Relatórios, Configurações, Manual e Informações.
- Cada módulo possui título, contexto e três ações de demonstração alinhadas à tela aberta.
- A troca de rota atualiza o card imediatamente.
- O card foi reduzido, ganhou destaque visual azul sutil e continua podendo ser fechado pelo visitante.

## Validações executadas

| Verificação | Resultado |
| --- | --- |
| `node --check tecnologia/demos/gestao-assistencia/demo-bypass.js` | Aprovado, sem erro de sintaxe. |
| Simulação isolada de navegação | Aprovada para conteúdo inicial, PDV e Estoque; o mesmo mapa cobre todos os módulos da navegação. |
| Busca de mojibake no arquivo modificado | Sem ocorrências. |
| `git diff --check -- tecnologia/demos/gestao-assistencia/demo-bypass.js` | Aprovado. |

## Pendências e riscos

- A avaliação visual local em desktop e mobile permanece para o responsável.
- O repositório tinha alterações fora deste pacote; nenhuma foi revertida ou reorganizada.

## Estado final

- Status: implementação concluída e validada de forma focada.
- Commit: não realizado.
- Push: não realizado.
