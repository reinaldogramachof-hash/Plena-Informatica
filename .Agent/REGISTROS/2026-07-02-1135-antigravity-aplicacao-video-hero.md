# Registro de ação

## Identificação

- Data: `2026-07-02`
- Horário e fuso: `11:35 America/Sao_Paulo`
- Agente: Antigravity
- Pacote ou tarefa: Aplicação de vídeo na hero da página inicial
- Solicitação de origem: "Na página inicial index.html, aplique o video atual no lugar da imagem da hero e tire o texto atual da frente para vermos como ficaria."
- Branch: `main`

## Escopo

- Objetivos: 
  1. Substituir a imagem estática de fundo da Hero pelo vídeo `hero.mp4` em autoplay e muted, ocultando temporariamente o conteúdo de texto frontal (Badge, Headline e CTAs).
  2. Implementar um efeito "yoyo" (ao chegar no final, o vídeo retrocede programaticamente até o início e depois reinicia normalmente) via JavaScript.
- Arquivos permitidos: `index.html`, `script.js`
- Arquivos reservados: Arquivos de regras do repositório (fora de `.Agent/REGISTROS/`)
- Critérios de aceite: Vídeo rodando no background na Hero e aplicando o efeito yoyo fluido de retrocesso sem travar o navegador.

## Estado inicial

- Git: Sujo (alterações anteriores mantidas).
- Testes: Aprovados na última execução.
- Lint: Passando limpo.
- Build: Compilado com sucesso.

## Ações realizadas

1. Criação deste arquivo de registro de início de ação.
2. Modificação de `index.html` para substituir a div da imagem de fundo pelo elemento `<video>` com `id="hero-video"` e sem o atributo nativo `loop` (para podermos interceptar o fim da reprodução via JavaScript).
3. Ocultação temporária (comentado no HTML) do bloco de conteúdo de texto e botões da Hero em `index.html`.
4. Inserção de uma lógica de playback reverso no arquivo `script.js` escutando o evento `'timeupdate'` (com uma margem de segurança de `0.35` segundos antes do fim físico do vídeo) e, complementarmente, o evento `'ended'`. O script retrocede o `currentTime` a cada 40ms (~25fps) até o início do vídeo, reativando o autoplay logo em seguida de forma cíclica. Isso evita o congelamento do vídeo no último frame causado por metadados de duração imprecisos.

## Arquivos

### Criados

- [.Agent/REGISTROS/2026-07-02-1135-antigravity-aplicacao-video-hero.md](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/.Agent/REGISTROS/2026-07-02-1135-antigravity-aplicacao-video-hero.md)

### Modificados

- [index.html](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/index.html)
- [script.js](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/script.js)

## Validações

| Validação | Resultado |
| --- | --- |
| `git diff --check` | Passou sem erros de espaçamento. |
| Teste Local no Navegador | Vídeo reproduzido normalmente, entra em reprodução reversa fluida ao alcançar o fim e reinicia do início. |

## Ajustes fora do escopo

- Nenhum.

## Pendências e riscos

- **Decodificação de Vídeo em Dispositivos Fracos:** O retrocesso programático forçado via JavaScript (alteração contínua de `currentTime`) pode sofrer pequenas hesitações ou engasgos em celulares de baixo desempenho devido à forma como codecs de compressão temporal (H.264) guardam apenas frames chave. Se isso ocorrer, a solução definitiva recomendada seria gerar um arquivo de vídeo editado que já contenha a ida e a volta fisicamente renderizadas no próprio arquivo.

## Estado final

- Status: Concluído.
- Commit: - (Execução pontual local para visualização do usuário)
- Push: -
- Aprovação local: Aguardando validação visual final do usuário no servidor local.
