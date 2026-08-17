# Registro de ação

## Identificação

- Data: `2026-08-14`
- Horário e fuso: `13:35 America/Sao_Paulo`
- Agente: Antigravity
- Pacote ou tarefa: Projeção 3D interativa de planta baixa no Hero.
- Solicitação de origem: "Vamos aplicar a abordagem A, pode construir."
- Branch: `main`

## Escopo

- Objetivo: Criar uma cena 3D interativa (WebGL) no fundo da Hero section representando uma planta baixa contemporânea cujas paredes se erguem (extrusão 3D) com o scroll da tela e reagem ao movimento do mouse.
- Arquivos permitidos:
  * [`tecnologia/sites-premium/arquitetura/index.html`](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/tecnologia/sites-premium/arquitetura/index.html)
- Critérios de aceite:
  * Criação do container `#hero-canvas` no HTML da Hero section.
  * Lógica Javascript em Three.js (`initHeroScene`) para modelar a maquete 3D holográfica com iluminação e grade de desenho técnico.
  * As paredes devem começar no chão (escala zero) e subir até a altura máxima com efeito de entrada suave.
  * O scroll da página deve influenciar a escala Y das paredes (erguendo/encolhendo conforme rola).
  * O mouse do usuário deve controlar levemente a rotação da planta nos eixos X e Y (efeito de parallax 3D interativo).
  * Estilização integrada em tons bronze escuro e marfim combinando com o tema "Atelier Forma".

## Estado inicial

- Git: Hero section limpa de elementos antigos de fundo e blocos gráficos no passo anterior.

## Ações realizadas

1. **Estrutura HTML e CSS:**
   * Inserido o elemento `<div id="hero-canvas" class="webgl-canvas hero-canvas" aria-hidden="true"></div>` no início do container `<section class="hero">`.
   * Recriadas as classes CSS `.webgl-canvas` e `.hero-canvas` com propriedades de posicionamento absoluto, índice z de background (`z-index: 0`) e mesclagem de tela de luxo (`mix-blend-mode: screen`, `opacity: .28`).

2. **Desenvolvimento da Lógica 3D (Three.js):**
   * Criada a função `initHeroScene()` contendo:
     * Câmera isométrica em perspectiva levemente inclinada.
     * Luz ambiente e luz direcional dourada simulando o tom bronze da marca.
     * Grid Helper estilizado (grade de prancheta de CAD).
     * Definição matemática de 9 paredes (perímetro e divisórias internas de um projeto residencial real de arquitetura contemporânea).
     * Translação de pivô para a base inferior da geometria das paredes (`geometry.translate(0, data.h/2, 0)`) para forçar o crescimento estritamente para cima.
     * Materiais combinados: faces sólidas translúcidas (`MeshStandardMaterial` com opacidade 0.04 e reflexo metálico) e bordas em wireframe brilhantes (`MeshBasicMaterial` bronze com opacidade 0.15) para o visual de holograma.
     * Nós de ancoragem brilhantes (esferas 3D bronze) nos principais vértices do projeto.
     * Mecanismo de render loop com suavização amortecida na entrada (`Math.sin()`).
     * Rastreamento dinâmico de `window.scrollY` para retroceder/avançar a altura das paredes conforme o scroll.
     * Rastreamento da posição do mouse (`mousemove`) para criar parallax na rotação da maquete.
     * Rotina de redimensionamento (`resize`) para manter a proporção da cena ao redimensionar a tela do navegador.
   * Ativada a inicialização do Hero na chamada geral dos scripts.

## Arquivos

### Criados

- Nenhum.

### Modificados

- [`tecnologia/sites-premium/arquitetura/index.html`](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/tecnologia/sites-premium/arquitetura/index.html)

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| `git diff --check` | Aprovado |

## Estado final

- Status: Concluído com sucesso (Ação 5).
- Commit: Pendente.
- Push: Pendente.
- Aprovação local: Solicitada ao responsável.
