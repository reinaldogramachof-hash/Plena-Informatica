# Registro de ação

## Identificação

- Data: `2026-07-29`
- Horário e fuso: `15:48 America/Sao_Paulo`
- Agente: Antigravity
- Pacote ou tarefa: Substituição do Hero Video pela Imagem plena.jpg
- Solicitação de origem: "Ok, agora faremos alguns ajustes pontuais a começar pela página inicial, observe que o Hero atual é um vídeo em MP4 que deve ser removiso e aplciado em seu lugar a imagem plena.jpg"
- Branch: main

## Escopo

- Objetivo: Substituir o vídeo HTML5 do background do Hero (`hero.mp4`) pela imagem estática `plena.jpg` no arquivo `index.html`, e adaptar os testes automatizados para essa alteração.
- Arquivos permitidos: `index.html`, `tests/*`
- Arquivos reservados: Nenhum
- Critérios de aceite:
  - O elemento `<video>` com o ID `hero-video` deve ser removido de `index.html`.
  - Um elemento `<img>` com o ID `hero-image` e o atributo `src="plena.jpg"` deve ser inserido em seu lugar.
  - Os testes de contrato devem passar após a mudança.

## Estado inicial

- Git: Sem alterações pendentes para commit
- Testes: Teste `tests/hero-video-contract.test.js` passava com sucesso
- Lint: Não configurado
- Build: Não configurado
- Riscos conhecidos: Quebrar a validação dos testes automatizados se eles persistirem em esperar o vídeo.

## Ações realizadas

1. Substituído o elemento `<video>` em `index.html` (linhas 226 a 230) pelo elemento `<img>` apontando para `plena.jpg` com `id="hero-image"`.
2. Removido o teste legado `tests/hero-video-contract.test.js` que testava o vídeo.
3. Criado o teste `tests/hero-image-contract.test.js` para validar a presença da imagem e a ausência do vídeo.
4. Executados testes de contrato localmente via node.

## Arquivos

### Criados

- [hero-image-contract.test.js](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/tests/hero-image-contract.test.js)

### Modificados

- [index.html](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/index.html)

### Removidos

- `tests/hero-video-contract.test.js`

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `node --test tests/hero-image-contract.test.js` | 1 pass, 0 fail (Sucesso) |

## Ajustes fora do escopo

- Nenhum.

## Pendências e riscos

- Nenhum.

## Estado final

- Status: Concluído.
- Commit: Pendente de commit pelo usuário ou comando posterior.
- Push: Não realizado.
- Aprovação local: Aguardando verificação manual do responsável.
