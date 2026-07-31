# Registro de ação

## Identificação

- Data: 2026-07-31
- Horário e fuso: 15:20 America/Sao_Paulo
- Agente: Claude (Cowork)
- Pacote ou tarefa: Imersão via código no modelo premium Arquitetura & Engenharia (Atelier Forma)
- Solicitação de origem: Reinaldo — elevar experiência do modelo; conectores de imagem (Higgsfield/Kairogen) indisponíveis por falta de créditos e trial inelegível; autorizada a via de código.
- Branch: trabalho direto na working tree

## Escopo

- Objetivo: elevar o nível de imersão do modelo sem custo de geração de imagens, mantendo o layout pronto para receber imagens de IA futuramente.
- Arquivos permitidos: `tecnologia/sites-premium/arquitetura/index.html`, este registro.
- Critérios de aceite:
  1. Novos efeitos funcionam sem dependências externas.
  2. `prefers-reduced-motion` desativa todas as animações novas.
  3. HTML válido e JS sem erro de sintaxe.

## Ações realizadas

1. Barra de progresso de leitura fixa no topo (gradiente bronze).
2. Parallax em camadas no hero: grid técnico e brilho cônico movem-se em velocidades opostas via CSS var `--par` atualizada com `requestAnimationFrame`.
3. Blueprint arquitetônico em SVG no hero (corte de casa com cotas) que se desenha ao carregar (stroke-dashoffset animado, 11 traços com delays escalonados). Oculto abaixo de 960 px.
4. Contadores animados nas estatísticas (120+/14/9) com easing cúbico, disparados por IntersectionObserver.
5. Faixa de disciplinas em marquee contínuo entre hero e portfólio (conteúdo duplicado para loop, `aria-hidden`).
6. Spotlight bronze que segue o cursor nos cards de projeto (apenas `pointer: fine`).
7. Reveals com stagger de 90 ms por posição no grupo.
8. Sublinhado animado nos links de navegação.
9. Bloco `prefers-reduced-motion` amplo: desativa marquee, blueprint (traços completos), parallax, contadores e reveals.

## Arquivos

### Modificados

- `tecnologia/sites-premium/arquitetura/index.html` (CSS, HTML e JS inline).

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| Parser HTML | Sem erros, pilha vazia |
| Checagem de mojibake | Sem ocorrências |
| Sintaxe do JS inline (node) | OK |

## Ajustes fora do escopo

- Nenhum.

## Pendências e riscos

- Contas Higgsfield (0 créditos, trial inelegível) e Kairogen (0 créditos) impedem a etapa de imagens reais; quando houver créditos, gerar 1 hero + 5 imagens de projetos e substituir os gradientes de `.proj-visual` e o fundo do hero.
- Validação visual em navegador real (320/375/768 px, teclado, reduced-motion) pendente antes de publicar.
- Modelo Clínica/Saúde ainda sem o mesmo nível de imersão — replicar padrão quando aprovado.

## Estado final

- Status: concluído (aguardando validação visual do integrador).
- Commit: não realizado.
- Push: não realizado.
- Aprovação local: pendente.
