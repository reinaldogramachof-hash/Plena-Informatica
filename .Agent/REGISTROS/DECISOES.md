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
