# Registro de ação

## Identificação

- Data: `2026-07-14`
- Horário e fuso: `21:55 America/Sao_Paulo`
- Agente: GPT Work
- Pacote ou tarefa: Correção de abertura da demo Gestão Gastro
- Solicitação de origem: a demo deixou de abrir após a publicação.
- Branch: `main`

## Diagnóstico

- O HTML e todos os arquivos referenciados retornavam HTTP `200`, mas o React não montava em `#root`.
- O console do Chrome identificou a exceção: importação do cliente Supabase exigia `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` mesmo com o modo demo ativado.
- Havia também um service worker da demonstração capaz de manter assets anteriores em cache.

## Ações realizadas

1. Ajustei a fonte do sistema para aceitar valores locais inofensivos somente em `VITE_DEMO_MODE`, sem expor credenciais ou alterar a exigência em produção.
2. Regenerei o build oficial da demonstração.
3. Atualizei o HTML para o novo bundle e removi o registro de PWA da demo.
4. Incluí o desregistro de service workers antigos na camada de demonstração para evitar reabertura com assets obsoletos.

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `npm.cmd run lint` na fonte | aprovado (`tsc --noEmit`) |
| `npm.cmd run build` na fonte | aprovado; avisos conhecidos de tamanho de chunk e chunk vazio do GenAI |
| HTTP do HTML e dos assets principais | `200` |
| Chrome headless com captura CDP | `#root` preenchido com Dashboard, 4 pedidos fechados, 3 pedidos abertos e dados fictícios de operação |

## Estado final

- Status: correção pronta para versionamento.
- Commit: pendente no momento deste registro.
- Push: pendente no momento deste registro.
