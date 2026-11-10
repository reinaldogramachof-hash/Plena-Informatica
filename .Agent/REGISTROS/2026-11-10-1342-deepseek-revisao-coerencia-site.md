# Registro de ação

## Identificação

- Data: `2026-11-10`
- Horário e fuso: `13:42 America/Sao_Paulo`
- Agente: DeepSeek (DeepSeek Harness)
- Pacote ou tarefa: Revisão de coerência visual e estrutural do site, com funil único para a página de Tecnologia
- Solicitação de origem: "faça uma revisão geral por todo o site para termos uma coerência visual e de estrutura desde a página inicial, agora direcionando para um único serviço a página de Tecnologia"
- Branch: `main`

## Escopo

- Objetivo: alinhar a camada institucional (home, blog, tecnologia) em torno da página de Tecnologia como único destino comercial, e fechar lacunas de estrutura e SEO.
- Arquivos alterados: `index.html`, `blog/index.html`, `sitemap.xml`, `.htaccess`.
- Fora do escopo nesta rodada: as 11 páginas de produto (`produtos/*.html`), que têm sistema de design próprio.

## Diagnóstico

- 14 páginas públicas: home, blog, tecnologia e 11 produtos.
- **Duas camadas de design conviventes**: home/blog/tecnologia usam `header.fixed` + `footer.bg-gray-950` (identidade Plena); os 11 produtos usam `header.header` + `footer.footer` (identidade de produto).
- A home não tinha **nenhum CTA na hero**: o maior espaço da página não levava a lugar nenhum.
- O menu da home e do blog ainda tinham o item "Serviços", apontando para a âncora `#services` — resquício da página de Serviços retirada em 10/11.
- O blog tinha **3 links "Ler mais" apontando para `#`** — becos sem saída.
- `sitemap.xml` listava **apenas 4 dos 11 produtos**.
- `.htaccess` tinha redirecionamento de produto para **apenas 4 dos 11** slugs.
- `gestao-gastro.html` é a única página de produto com duas tags `<footer>` (rodapé institucional + crédito do produto); as outras 10 têm apenas o crédito de uma linha, **sem nenhum link de volta ao site**.
- Peso: `logoplena.svg` com 4,52 MB e `plena.jpg` com 0,57 MB na hero.

## Ações realizadas

1. `index.html`: item de menu "Serviços" → **"Tecnologia"**, agora apontando para `tecnologia/tecnologia.html` no desktop e no menu mobile.
2. `index.html`: incluídos dois CTAs na hero — **"Ver catálogo de sistemas"** (laranja, leva à página de Tecnologia) e **"Falar no WhatsApp"** — logo abaixo do H1, com o mesmo vocabulário visual dos demais botões do site.
3. `blog/index.html`: item de menu "Serviços" → **"Tecnologia"** apontando para a página, no desktop e no mobile.
4. `blog/index.html`: os três links "Ler mais" (`href="#"`) viraram o rótulo **"Em breve"**, eliminando os becos sem saída enquanto não houver artigos publicados.
5. `sitemap.xml`: incluídos os 7 produtos ausentes (terapia, odonto, fit, lava-rápido, sorveteria, PDV, salas). O sitemap passou de 10 para 17 URLs, e as 17 foram conferidas contra o disco.
6. `.htaccess`: incluídos os 7 redirecionamentos de slug de produto que faltavam, no mesmo padrão dos existentes.

## Validações

| Verificação | Resultado |
| --- | --- |
| URLs do sitemap com arquivo correspondente | 17 de 17 |
| Links locais em `index.html` | 10, nenhum quebrado |
| Links locais em `blog/index.html` | 14, nenhum quebrado |
| Tags HTML nas duas páginas | equilibradas |
| `href="#"` restantes em página pública | apenas os preenchidos por JS (`#demo-newtab`, `#demo-direct-link`) |
| `git diff --check` | limpo |

## Pendências e recomendações

- **Camada de produto é o maior desvio estrutural.** As 11 páginas usam cabeçalho e rodapé próprios; 10 delas não têm nenhum link de volta ao site além do item "Tecnologia" no topo. O caminho recomendado é um rodapé institucional enxuto (Início, Tecnologia, Blog, contato) em todas, substituindo o crédito de uma linha.
- **Cores por produto**: cada página tem sua própria cor de destaque (verde no Fit, ciano no Odonto, etc.). É defensável como identidade de produto, mas diverge do laranja institucional — precisa de decisão.
- **Blog sem conteúdo**: as três matérias não existem. Publicar ou retirar o blog da navegação.
- **`gestao-gastro.html` com duas tags `<footer>`** — revisar qual das duas permanece.
- **Peso**: `logoplena.svg` (4,52 MB) é o maior ativo do site e aparece no topo de todas as páginas.
- A ação não foi commitada nesta rodada.

## Estado final

- Status: implementado, aguardando validação local.
- Commit: não realizado.
- Push: não realizado.

## Adendo — 2026-11-10 14:25 — Blog removido do site

- Solicitação: "pode remover o blog" — depois da recomendação de não manter uma cadência diária de conteúdo sem medição nem artigos publicados.
- Ações:
  1. `blog/index.html` removido, junto com a pasta `blog/`.
  2. Removidos os três links do blog em `index.html`: navbar desktop, menu mobile e item "Blog e Dicas" do rodapé.
  3. `sitemap.xml`: removida a entrada `/blog/` (de 17 para 16 URLs, todas conferidas contra o disco).
  4. `.htaccess`: 301 de `/blog/` e de qualquer subcaminho para a página inicial, para não deixar a URL antiga retornando 404.
  5. `tools/maintenance/audit-public-root.js` e `fix-public-mojibake.js`: retirado `'blog'` da lista de raízes públicas, que passaria a apontar para pasta inexistente.
- Preservado: a página de demonstração `tecnologia/landing-pages/lp-01-lancamento.html` tem um item "Blog" próprio, que é conteúdo fictício do modelo e não link para o blog do site.
- Validações: nenhuma referência a `/blog/` em HTML ou XML; `index.html` com 7 links locais e nenhum quebrado; 16 URLs no sitemap, todas com arquivo; tags equilibradas; `git diff --check` limpo.
- Registro anterior desta sessão recomendou não alimentar o blog diariamente e indicou a escada de prioridades (medição, Hub de ferramentas, presença local, páginas de produto) — mantida como referência para as próximas frentes.
