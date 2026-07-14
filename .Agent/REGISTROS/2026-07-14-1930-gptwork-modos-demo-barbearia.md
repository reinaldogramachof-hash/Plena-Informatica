# Registro de ação

## Identificação

- Data: `2026-07-14`
- Horário e fuso: `19:30 America/Sao_Paulo`
- Agente: GPT Work
- Pacote ou tarefa: modos de demonstração Gestão Barbearia Pro
- Solicitação de origem: replicar o padrão de demonstração do Gestão Assistência.

## Objetivo

Exibir a demo da Barbearia em modo compacto na página Tecnologia e em tela cheia na landing interna, com roteiro de uso específico para cada módulo do sistema.

## Arquivos modificados

- `tecnologia/tecnologia.html`
- `tecnologia/demos/gestao-barbearia/demo-bypass.js`
- `.Agent/REGISTROS/2026-07-14-1930-gptwork-modos-demo-barbearia.md`

## Resumo das mudanças

- O card da Barbearia na página Tecnologia passou a solicitar explicitamente o modo `compact`.
- A landing interna permanece com `data-demo-fullscreen="true"`, abrindo a demo em tela cheia.
- O roteiro inferior direito passou a ser contextual para Dashboard, Agenda, Barbeiros, Serviços, Estoque, Financeiro, PDV, Clientes, Relatórios, Configurações, Manual, Notificações e Informações.
- O card de roteiro foi compactado e mantém a opção de fechamento.
- Corrigida a acentuação de `dados fictícios` na confirmação de reset.

## Validações executadas

| Verificação | Resultado |
| --- | --- |
| Sintaxe de `demo-bypass.js` | Aprovada. |
| Modo compacto no card Tecnologia | Confirmado. |
| Modo tela cheia na landing interna | Confirmado. |
| Mapa de roteiros por módulo | Confirmado para 13 módulos. |
| Busca de mojibake nos arquivos modificados | Sem ocorrências. |
| `git diff --check` dos arquivos modificados | Aprovado. |

## Pendências e riscos

- A validação visual local dos dois modos de demo permanece para o responsável.
- Alterações preexistentes fora deste pacote foram preservadas.

## Estado final

- Status: implementação concluída e validada de forma focada.
- Commit: não realizado.
- Push: não realizado.
