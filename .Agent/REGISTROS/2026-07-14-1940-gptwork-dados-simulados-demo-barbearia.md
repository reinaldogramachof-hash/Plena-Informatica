# Registro de ação

## Identificação

- Data: `2026-07-14`
- Horário e fuso: `19:40 America/Sao_Paulo`
- Agente: GPT Work
- Pacote ou tarefa: dados simulados e roteiros da demo Gestão Barbearia Pro
- Solicitação de origem: povoar a demonstração com dados fictícios e ajustar os roteiros conforme as ações visíveis.

## Objetivo

Oferecer uma demonstração comercial completa, com informações fictícias coerentes em cada módulo e orientações práticas para a exploração do sistema.

## Arquivos modificados

- `tecnologia/demos/gestao-barbearia/demo-bypass.js`
- `tecnologia/demos/gestao-barbearia/sw.js`
- `.Agent/REGISTROS/2026-07-14-1940-gptwork-dados-simulados-demo-barbearia.md`

## Resumo das mudanças

- Incluída semeadura automática, limitada a demos sem dados prévios, para agenda, equipe, serviços, clientes, estoque, movimentações e financeiro.
- Criada a operação fictícia `Barbearia Central`, com três barbeiros, quatro clientes, cinco produtos, agendamentos e lançamentos financeiros representativos.
- Incluídos itens com estoque normal, baixo e esgotado para demonstrar alertas e movimentações.
- Adicionado lançamento fiado e comissões para enriquecer os módulos Financeiro, Clientes e Barbeiros.
- Ajustados os roteiros de Dashboard, Agenda, Equipe, Serviços, Estoque, Financeiro, PDV, Clientes, Relatórios e Configurações para apontar para os dados reais da demo.
- Atualizado o cache do service worker para `app-cache-v4.3`, garantindo a entrega da nova versão do script.

## Validações executadas

| Verificação | Resultado |
| --- | --- |
| Sintaxe de `demo-bypass.js` | Aprovada com `node --check`. |
| Presença da chave de semeadura e dos dados principais | Confirmada por inspeção estática. |
| Arquivos atualizados no servidor local | Confirmados por HTTP. |
| Cache do service worker | Confirmado como `app-cache-v4.3`. |

## Pendências e riscos

- Uma aba já aberta precisa ser recarregada uma vez para ativar o novo cache; em seguida, usar `Resetar demo` caso mantenha dados anteriores no navegador.
- A validação visual interativa no navegador permanece recomendada ao responsável.
- Alterações preexistentes fora deste pacote foram preservadas.

## Estado final

- Status: implementação concluída e validada de forma focada.
- Commit: não realizado.
- Push: não realizado.
