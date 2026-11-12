# Registro de decisões

## 2026-06-11 — Base única para colaboração entre agentes

- Origem: responsável pelo projeto.
- Decisão: criar a pasta versionada `.Agent` como contrato operacional comum.
- Motivo: permitir colaboração entre Codex, Claude Code, Antigravity e outros
  agentes sem perda de contexto ou sobreposição de trabalho.
- Consequência: todo agente deve ler esta base antes de atuar.

## 2026-06-11 — Integração pública centralizada

- Origem: ROADMAP do Hub de Soluções Digitais.
- Decisão: agentes funcionais não liberam cards, manifestos ou rotas públicas.
- Motivo: evitar estados inconsistentes durante execução paralela.
- Consequência: a liberação é responsabilidade de um integrador único após
  validação local.

## 2026-06-11 — Registros históricos não são apagados

- Origem: governança de colaboração.
- Decisão: decisões e feedbacks são append-only.
- Motivo: manter rastreabilidade das orientações e mudanças de processo.
- Consequência: uma regra superada recebe novo registro, sem remoção do anterior.

## 2026-06-11 — Controle de caixa será reconstruído no painel atual

- Origem: auditoria de `Plena-Controle-de-Caixa--main.zip`.
- Decisão: migrar fluxos e regras de negócio úteis para o painel administrativo
  existente, sem incorporar o aplicativo legado como segunda aplicação.
- Motivo: o painel atual já possui autenticação, Supabase, RLS, testes e padrão
  visual; o legado depende de `localStorage`, senha fixa e integrações inseguras.
- Consequência: a primeira etapa futura será o núcleo financeiro com receitas,
  despesas e fechamento diário.
- Documento: `docs/superpowers/specs/2026-06-11-admin-cash-control-integration-design.md`.

## 2026-11-11 — Identidade de consultório para Gestão Terapia

- Origem: responsável pelo projeto, após avaliação do piloto visual.
- Decisão: orientar a landing de Terapia pela atmosfera da fotografia de consultório fornecida e pela referência Clínica Vitalis: base clara quente, verde profundo, títulos serifados e composições com telas reais da demo.
- Alternativa considerada: manter a direção navy/azul do primeiro piloto.
- Motivo: aproximar a apresentação do contexto de trabalho do terapeuta, mantendo o sistema identificável e demonstrável.
- Consequência: implementação isolada no Terapia; replicação para outros segmentos depende da aprovação e adaptação de cada identidade.

## 2026-11-11 — Arquitetura comercial por intenção e segmento

- Origem: responsável aprovou a avaliação de SEO e autorizou a adaptação do site.
- Decisão: manter a home como portal institucional, o catálogo como distribuidor e as landing pages como destinos comerciais específicos. Serviços de sites, e-commerce e automações têm páginas comerciais próprias; modelos e demos permanecem referências navegáveis fora dos resultados de busca.
- Motivo: reduzir escolhas intermediárias para quem procura uma solução de um segmento e diferenciar compra de sistema de contratação de desenvolvimento.
- Consequência: preservar URLs dos produtos, links diretos na home e catálogo, metadados individuais, sitemap comercial e separação entre modelos e ofertas. Campanhas apontam para a página da intenção correspondente.
- Implementação e mensuração: `docs/estrategia/ARQUITETURA-COMERCIAL-SEO-2026-11-11.md`. Configuração de Search Console/GA4 e publicação não foram realizadas nesta tarefa.

## 2026-11-12 — Acesso direto aos modelos e retorno por origem

- Origem: responsável solicitou revisão dos portais e dos caminhos de retorno.
- Decisão: modelos acessíveis diretamente pelas categorias de Tecnologia e pelos atalhos da home. Páginas comerciais continuam disponíveis como destinos opcionais de planejamento.
- Alternativa considerada: manter a passagem obrigatória pelo portal de sites e retornos fixos para esse portal.
- Motivo: evitar etapas intermediárias e permitir retorno claro à página inicial ou à categoria de Tecnologia conforme o início do percurso.
- Implementação local: origem limitada a `inicio` ou `tecnologia` na URL, sem armazenamento persistente; acesso direto usa Tecnologia como fallback. Revisão visual do responsável permanece pendente antes do deploy.
- Evidências: `2026-11-12-codex-navegacao-modelos.md`.

## 2026-11-12 — Retorno integrado e aposentadoria do portal premium

- Origem: responsável solicitou remover o novo botão de origem para não atrapalhar a navegação e confirmou a retirada dos portais antigos.
- Decisão: remover o retorno flutuante; usar links existentes e, nos modelos sem retorno, links no rodapé em fluxo normal. O portal premium passa a redirecionar à categoria Sites Premium em Tecnologia; aliases de landing pages e e-commerce também apontam às categorias.
- Motivo: manter acesso direto aos modelos sem sobrepor a interface ou adicionar etapas intermediárias.
- Substitui: a preservação do portal premium como destino opcional de planejamento descrita na decisão anterior desta data. Páginas específicas de serviços continuam disponíveis.
- Sitemap: remover a URL aposentada do portal premium; preservar os modelos individuais.
- Evidências: `2026-11-12-codex-remocao-retorno-flutuante.md`.

## 2026-11-12 — Produção sem Hub e sem áreas antigas

- Origem: responsável esclareceu o escopo do deploy e confirmou manter produtos, modelos e demos abertos por home/Tecnologia.
- Decisão: publicar essas duas entradas com seus destinos e assets; excluir Hub, ferramentas, fontes de serviços e sistemas de referência antigos. Endereços aposentados encaminham à Tecnologia.
- Motivo: substituir a produção por uma árvore limpa correspondente ao site atual, sem reintroduzir áreas retiradas.
- Backup de referência serve para inventário, não para copiar dependências, ambientes ou arquivos internos ao pacote.
- Documento: `docs/deploy/PUBLICACAO-COMPLETA-2026-11-12.md`.
