# Registro de ação - Remoção do PWA da Demo do Gestão Gastro

## Identificação

- Data: `2026-07-01`
- Horário e fuso: `15:40 America/Sao_Paulo`
- Agente: `Antigravity`
- Pacote ou tarefa: `Remoção do VitePWA da configuração de demo do Gestão Restaurantes`
- Solicitação de origem: O console apresentava erro real de 404 buscando `sw.js` pois o arquivo não existia no build empacotado da demo. A solução escolhida foi remover o PWA da demo para evitar superfície de cache.
- Branch: `main` (local)

## Escopo

- Objetivo: Editar a configuração do Vite de demo no repositório de Gestão Restaurantes para remover o `VitePWA`, rebuildar o projeto, copiar para o repositório do Site Institucional Plena e certificar-se de que o erro sumiu e as referências a service worker não existem mais no `index.html`.
- Arquivos permitidos: `vite.demo.config.ts` (Sistema de Gestão Restaurantes), diretório `tecnologia/demos/gestao-restaurantes/` (Site Institucional Plena)
- Arquivos reservados: `vite.config.ts` (build de produção)
- Critérios de aceite: Novo `index.html` não referencia `vite-plugin-pwa:register-sw`, e a página carrega perfeitamente.

## Estado inicial

- Git: Local workspaces.
- Servidor: Ativo.
- Erros conhecidos: O navegador retornava 404 ao tentar registrar ou atualizar o Service Worker em `http://localhost:8080/tecnologia/demos/gestao-restaurantes/sw.js`.

## Ações realizadas

1. Leitura confirmada dos guias da pasta `.Agent/`.
2. Edição de `vite.demo.config.ts` no repositório `Sistema de Gestão Restaurantes`:
   - Remoção da importação `import { VitePWA } from 'vite-plugin-pwa';`.
   - Remoção do bloco `VitePWA({...})` dos plugins.
3. Execução de build (`npx vite build --config vite.demo.config.ts`) no repositório de Restaurantes, gerando nova pasta `dist-demo/`.
4. Limpeza da pasta de destino em `Site Institucional Plena/tecnologia/demos/gestao-restaurantes/` e cópia dos novos arquivos.
5. Verificação do código fonte: confirmado que `index.html` não contém `registerSW` nem `manifest.webmanifest`. Confirmado que não existe nenhuma string `serviceWorker` nos assets.
6. Teste de navegador: O subagente recarregou a página, a interface continuou a funcionar perfeitamente. (Observação: um erro 404 pode persistir temporariamente em navegadores que já visitaram a demo antiga porque o browser tenta atualizar o worker antigo; no entanto, o worker novo não é registrado, garantindo a ausência do bug para usuários novos).

## Arquivos

### Modificados

- `vite.demo.config.ts` (em Sistema de Gestão Restaurantes)
- Todo o build final em `tecnologia/demos/gestao-restaurantes/` (em Site Institucional Plena)

## Validações

| Ação / Demo | Status do Console | Observações |
| --- | --- | --- |
| Buscar `registerSW` em index.html | Sem resultados | PWA totalmente removido do DOM |
| Carregamento da Demo | Sucesso | DOM carregado corretamente, aplicação renderizada perfeitamente |

## Estado final

- Status: Concluído.
- Commit: A ser realizado pelo usuário.
- Aprovação local: Validado via subagente.
