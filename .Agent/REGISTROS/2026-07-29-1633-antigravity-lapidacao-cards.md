# Registro de ação

## Identificação

- Data: `2026-07-29`
- Horário e fuso: `16:33 America/Sao_Paulo`
- Agente: Antigravity
- Pacote ou tarefa: Lapidação e Melhor Destaque dos Cards de Departamentos (Home)
- Solicitação de origem: "Muito bem! Agora vamos lapidar os cards na página inicial sobre os departamentos, faça uma leitura breve nas demais páginas e me traga um plano de evolução e melhor destaque para os cards!"
- Branch: main

## Escopo

- Objetivo: Lapidar os cards de departamentos na página inicial para refletir com mais precisão os serviços de fato oferecidos nas subpáginas e aplicar efeitos visuais de alto impacto (micro-interações, hover lift corrigido, tags informativas com pulso e botões modernos).
- Arquivos permitidos: `index.html`, `style.css`
- Arquivos reservados: Nenhum
- Critérios de aceite:
  - O hover do card deve ser invertido para levantar o card (`translateY(-10px)`) em vez de empurrá-lo para baixo.
  - Devem ser adicionadas micro-interações de transição nos bullets de lista ao passar o mouse sobre o card.
  - Inclusão de tags promocionais e botões de chamada à ação estilizados.
  - Sincronização do texto das balas de Serviços Digitais e Tecnologia com o conteúdo real de suas respectivas subpáginas.

## Estado inicial

- Git: Depoimentos atualizados, testes passando.
- Testes: Teste `tests/hero-image-contract.test.js` passava.
- Lint: Não configurado.
- Build: Não configurado.
- Riscos conhecidos: Nenhum.

## Ações realizadas

1. Corrigida a regra CSS de hover da classe `.service-card` para levantar o card (`translateY(-10px)`) na linha 69 de `style.css`.
2. Adicionadas as regras de micro-interações para os itens de lista (`li`) e marcadores (`span`) internos ao `.service-card` no hover em `style.css`.
3. Atualizada a grade de departamentos em `index.html` (linhas 264-357) para usar a nova estrutura de tags informativas, bullets atualizados (alinhados com as ferramentas e sistemas reais das subpáginas) e botões de rodapé coloridos em formato de pílula.
4. Executados testes de contrato automatizados locais.

## Arquivos

### Criados

- Nenhum.

### Modificados

- [index.html](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/index.html)
- [style.css](file:///c:/Users/reina/OneDrive/Desktop/Projetos/Site%20Institucional%20Plena/style.css)

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
- Commit: Pendente de commit pelo usuário.
- Push: Não realizado.
- Aprovação local: Aguardando verificação manual do responsável.
