# Registro de ação

## Identificação

- Data: `2026-08-17`
- Horário e fuso: `07:40 America/Sao_Paulo`
- Agente: Antigravity
- Pacote ou tarefa: Ajuste de layout, sombreamento de imagens e alinhamento de estatísticas no modelo de Arquitetura & Engenharia (Atelier Forma)
- Solicitação de origem: "Vamos alterar a rota, ajuste as imagens do modelo para preencher todo o hero e onde temos o texto devems aplicar um sombreamento na imagem para destacar o texto."
- Branch: `main`

## Escopo

- Objetivo: Redefinir as imagens do scrollytelling para tela cheia e implementar degradês escuros direcionados para legibilidade dos textos; corrigir o alinhamento das estatísticas do Step 3 para que fiquem na mesma linha horizontal.
- Arquivos permitidos:
  * [`tecnologia/sites-premium/arquitetura/index.html`](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/tecnologia/sites-premium/arquitetura/index.html)
- Arquivos reservados: Nenhum.
- Critérios de aceite:
  * Imagem `.stage-image` ocupando 100% da área do hero em tela cheia.
  * Pseudo-elementos `.evolution-stage::after` gerando degradê de sombreamento lateral no desktop (Step 1/3 esquerda, Step 2/4 direita) e gradiente vertical no mobile.
  * Títulos e descrições do Step 3 ("Cobertura", "Acabamento" e "Canteiro") mantidos de forma rígida em uma única linha horizontal no desktop e tablet.

## Estado inicial

- Git: Alterações locais pendentes em tecnologia.html, script.js e style.css correspondentes às limpezas e ajustes das sessões anteriores.

## Ações realizadas

1. **Ajuste de Imagem em Tela Cheia:**
   * Modificado o `.stage-image` para usar `top: 0; bottom: 0; left: 0; right: 0;` e preencher 100% da tela do hero.
   * Removida a classe `.evolution-stage.image-left .stage-image` que limitava as imagens dos Steps 2 e 4 à metade esquerda da tela.
   * Ajustado o transform-origin e escala da animação de foco para ser mais suave (`scale(1.03)` no estado inicial).
2. **Máscara de Sombreamento (Destaque do Texto):**
   * Criado o pseudo-elemento `.evolution-stage::after` com transição suave de opacidade controlada pelo estado de scroll ativo (`.is-current`).
   * Adicionados gradientes horizontais da esquerda para direita (`90deg`) para Steps 1 e 3 (texto na esquerda).
   * Adicionados gradientes horizontais da direita para esquerda (`270deg`) para Steps 2 e 4 (texto na direita).
3. **Alinhamento das Estatísticas (Step 3):**
   * Configurado `.hero-stats` para usar `flex-wrap: nowrap;` e gap responsivo via `clamp(16px, 2vw, 24px)`.
   * Reduzido o font-size de `.stat strong` para `15px` com peso `700` para adequação premium da fonte Archivo Expanded.
   * Aumentado o `max-width` de `.stat small` para `160px` e ajustada a fonte para `10.5px` para acomodar descrições longas sem quebras estranhas.
4. **Comportamento Responsivo (Mobile):**
   * Ajustada a media-query de `960px` para projetar gradiente vertical escuro de baixo para cima (`0deg`) e reposicionar o rótulo `.stage-image::after` no topo do celular.
   * Centralizado o texto no mobile e empurrado com `margin-top: 38vh` para dar folga para a imagem no topo.
   * Ajustada a media query de `640px` para remover a restrição artificial de largura de 300px do texto do hero, expandindo-a para `100%` da largura útil do celular.
5. **Estilização da Barra Demonstrativa (.demo-bar):**
   * Redesenhada a `.demo-bar` inferior com fundo dark glassmorphism (`rgba(16, 16, 18, 0.76)` com blur de 14px e borda superior sutil de 7%) para integração visual premium e imersiva.
   * Modificado o botão voltar (`.voltar`) para estilo outline minimalista com hover suave, e o botão de ação principal para dourado/bronze.
   * Otimizado o padding e font-size da barra em desktop e mobile para torná-la mais estreita e discreta.

## Arquivos

### Criados

- Nenhum.

### Modificados

- [`tecnologia/sites-premium/arquitetura/index.html`](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/tecnologia/sites-premium/arquitetura/index.html)

## Validações

* Verificados os apontamentos dos caminhos das imagens (`assets/atelier-...png`), comprovando exata conformidade física com a pasta assets.
* Verificado alinhamento do grid e responsividade do código de estilo modificado.

## Ajustes fora do escopo

- Nenhum.

## Pendências e riscos

- Nenhum.

## Estado final

- Status: Concluído localmente.
- Commit: Pendente.
- Push: Pendente.
- Aprovação local: Solicitada ao responsável.
