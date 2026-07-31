# Registro de ação

## Identificação

- Data: 2026-07-31
- Horário e fuso: 15:35 America/Sao_Paulo
- Agente: Claude (Cowork)
- Pacote ou tarefa: Imersão via código no modelo premium Clínica & Saúde (Clínica Vitalis)
- Solicitação de origem: Reinaldo — replicar evolução de imersão aprovada no modelo Arquitetura
- Branch: trabalho direto na working tree

## Escopo

- Objetivo: elevar a imersão do modelo mantendo identidade calma/acolhedora do segmento saúde (decisão de direção: sem marquee nem efeitos editoriais agressivos do modelo Arquitetura).
- Arquivos permitidos: `tecnologia/sites-premium/clinica-saude/index.html`, este registro.
- Critérios de aceite: efeitos sem dependências externas; `prefers-reduced-motion` desativa tudo; HTML/JS válidos.

## Ações realizadas

1. Barra de progresso de leitura (gradiente verde→dourado).
2. Linha de eletrocardiograma em SVG na base do hero, desenhando-se ao carregar (stroke-dashoffset, 3,2 s).
3. Flutuação suave contínua dos chips informativos (bob 5,5 s, delays alternados) e da cruz da composição visual.
4. Parallax sutil da composição do hero ao rolar (fator 0,06, via rAF).
5. Contadores animados nos chips com suporte a decimais em pt-BR ("+12" e "4,9" com vírgula).
6. Brilho verde suave que segue o cursor nos cards de especialidades (apenas `pointer: fine`).
7. Reveals com stagger de 80 ms por grupo.
8. Sublinhado animado verde nos links de navegação.
9. Bloco `prefers-reduced-motion` desativando ECG, bob, parallax, contadores e reveals.

## Arquivos

### Modificados

- `tecnologia/sites-premium/clinica-saude/index.html` (CSS, HTML e JS inline).

## Validações

| Comando ou teste | Resultado |
| --- | --- |
| Parser HTML | Sem erros, pilha vazia |
| Checagem de mojibake | Sem ocorrências |
| Sintaxe do JS inline (node) | OK |

## Ajustes fora do escopo

- Nenhum.

## Pendências e riscos

- Imagens reais (fotos de clínica/equipe) pendentes de créditos nos conectores de IA — mesmo plano do modelo Arquitetura.
- Validação visual em navegador real (320/375/768 px, teclado, reduced-motion) pendente antes de publicar.

## Estado final

- Status: concluído (aguardando validação visual do integrador).
- Commit: não realizado.
- Push: não realizado.
- Aprovação local: pendente.
