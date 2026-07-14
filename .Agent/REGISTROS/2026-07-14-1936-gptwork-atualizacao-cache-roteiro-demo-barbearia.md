# Registro de ação

## Identificação

- Data: `2026-07-14`
- Horário e fuso: `19:36 America/Sao_Paulo`
- Agente: GPT Work
- Pacote ou tarefa: atualização do roteiro contextual da demo Gestão Barbearia Pro
- Solicitação de origem: revisar porque o card da demo continuava exibindo o roteiro antigo para todos os módulos.

## Objetivo

Garantir que a demo carregue o roteiro específico do módulo ativo, em vez de uma cópia antiga mantida pelo cache offline.

## Arquivos modificados

- `tecnologia/demos/gestao-barbearia/sw.js`
- `.Agent/REGISTROS/2026-07-14-1936-gptwork-atualizacao-cache-roteiro-demo-barbearia.md`

## Resumo das mudanças

- Confirmado que `demo-bypass.js` já contém roteiros contextuais para 13 módulos, com o título `O que testar agora`.
- Incrementada a versão do cache do service worker de `app-cache-v4.1` para `app-cache-v4.2`.
- A ativação do novo service worker remove o cache anterior e permite que a demo busque o roteiro atualizado.

## Validações executadas

| Verificação | Resultado |
| --- | --- |
| Sintaxe de `demo-bypass.js` | Aprovada com `node --check`. |
| Roteiro antigo no arquivo atual | Não encontrado. |
| Roteiros contextuais por módulo | Confirmados para 13 módulos. |
| Service worker servido localmente | Retornou `app-cache-v4.2`. |
| `git diff --check` dos arquivos da correção | Aprovado. |

## Pendências e riscos

- Uma aba que já estava aberta precisa ser recarregada uma vez para ativar o novo service worker; se necessário, usar recarga forçada antes de reabrir a demo.
- Alterações preexistentes fora deste pacote foram preservadas.

## Estado final

- Status: correção aplicada e validada de forma focada.
- Commit: não realizado.
- Push: não realizado.
