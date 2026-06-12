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
