# Reconstrução visual — página Tecnologia

- **Objetivo:** elevar a página `tecnologia/tecnologia.html` a uma experiência institucional de empresa de tecnologia, preservando catálogo comercial, CTAs, demos e contratos existentes.
- **Arquivos modificados:**
  - `tecnologia/tecnologia.html`
  - `tecnologia/style.css`
  - `.Agent/REGISTROS/2026-07-14-2300-gptwork-reconstrucao-visual-tecnologia.md`
- **Resumo das mudanças:**
  - Navegação recebeu marca tipográfica vetorial, eliminando a dependência visual da imagem de logo com fundo branco nesta página.
  - Hero foi reconstruída em duas colunas: proposta comercial objetiva à esquerda e painel de visão da entrega à direita, sem criar novos caminhos comerciais.
  - O painel reforça os três tipos de solução já presentes no catálogo: sistemas de gestão, páginas comerciais e projetos sob medida.
  - Catálogo, processo, cenários, FAQ e CTA final receberam acabamento visual coerente com a nova linguagem, mantendo todos os cards, links e atributos de rastreamento intactos.
  - A hero foi ajustada para mobile com um único fluxo, recuos consistentes e sem overflow horizontal.
- **Validações executadas:**
  - Captura local em desktop para `/tecnologia/tecnologia.html`.
  - Viewport emulado de 375 px: documento, hero, título e painel dentro da largura disponível, sem overflow horizontal.
  - Preservação verificada: 29 chamadas `openDemoModal`, 90 atributos `data-offer`, 90 `data-category` e 60 `data-action` continuam presentes no arquivo.
  - `git diff --check` sem apontamentos.
- **Pendências/riscos:** nenhuma mudança foi feita em demos, projetos do catálogo, links de sistema ou lógica de modal. O arquivo-base ainda contém ocorrências legadas de mojibake fora dos trechos alterados; esta ação não introduziu novas ocorrências e não ampliou o escopo para saneamento textual. A aprovação visual final permanece com o responsável.
- **Commit/push:** não realizados nesta ação.
