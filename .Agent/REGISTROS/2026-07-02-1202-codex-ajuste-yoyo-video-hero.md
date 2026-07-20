# Registro de ação

## Identificação

- Data: `2026-07-02`
- Horário e fuso: `12:02 America/Sao_Paulo`
- Agente: Codex
- Pacote ou tarefa: Ajuste do efeito vai e vem do vídeo da hero
- Solicitação de origem: Ajustar o efeito de vai e vem do vídeo após a versão anterior baseada em `requestAnimationFrame`.
- Branch: `main`

## Escopo

- Objetivo: reduzir engasgos do retrocesso programático do vídeo `hero.mp4` na hero da página inicial.
- Arquivo permitido e modificado: `script.js`
- Arquivos preservados: alterações paralelas já existentes em `index.html`, produtos, Hub, QR Code, tecnologia e assets.
- Critérios de aceite: retrocesso com menos seeks por segundo, sem reverter a aplicação do vídeo e com validação servida pelo servidor local.

## Estado inicial

- Git: sujo, com muitas alterações anteriores de outros agentes.
- Servidor estático: já ativo em `http://127.0.0.1:8080/`.
- Diagnóstico: a versão anterior escrevia `video.currentTime` a cada quadro de `requestAnimationFrame`, o que transforma cada frame em um seek e pode causar engasgos em MP4.

## Ações realizadas

1. Leitura da base obrigatória `.Agent`.
2. Leitura dos registros recentes de ativação do servidor e aplicação do vídeo na hero.
3. Criação de um harness local em Node para reproduzir a pressão de seeks do retrocesso.
4. Ajuste de `script.js` para limitar o scrub reverso a 24 fps, calcular a posição por tempo absoluto, reduzir a velocidade reversa para `0.82` e respeitar `prefers-reduced-motion`.
5. Verificações locais de sintaxe, whitespace e servidor HTTP.

## Arquivos

### Criados

- `.Agent/REGISTROS/2026-07-02-1202-codex-ajuste-yoyo-video-hero.md`

### Modificados

- `script.js`

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| Harness Node antes do ajuste | Falhou como esperado: 6 escritas em `currentTime` em 6 frames simulados. |
| Harness Node após o ajuste | Passou: 2 escritas em `currentTime` em 6 frames simulados. |
| `node --check script.js` | Passou sem erro de sintaxe. |
| `git diff --check` | Passou; exibiu apenas aviso pré-existente de normalização CRLF em `tecnologia/tecnologia.html`. |
| `Invoke-WebRequest http://127.0.0.1:8080/` | HTTP 200. |
| `Invoke-WebRequest http://127.0.0.1:8080/script.js` | HTTP 200. |
| `Invoke-WebRequest http://127.0.0.1:8080/hero.mp4 -Method Head` | HTTP 200, `Content-Type: video/mp4`, `Content-Length: 6283978`. |

## Pendências e riscos

- A validação visual em navegador embutido não foi possível porque nenhum backend de browser estava disponível nesta sessão.
- Como MP4 não toca reverso nativamente no navegador, a solução definitiva mais fluida continua sendo renderizar um arquivo de vídeo já contendo ida e volta no próprio asset.

## Estado final

- Status: ajuste aplicado localmente e validado por harness/HTTP.
- Commit: -
- Push: -
- Aprovação local: pendente de validação visual pelo responsável no navegador.
