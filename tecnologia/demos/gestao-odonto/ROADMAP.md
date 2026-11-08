# ROADMAP — Gestão Odonto (Plena Odonto)

Data de admissão: 2026-07-30 | Origem: `Mercado Livre Aplicativos/gestao-odonto` (versão raiz 08/05/2026 — a mais recente entre os admitidos, sem `.bak`)
Status: 🆕 admitido na 1ª onda de entrada ML | Prioridade: **#3 da onda**

---

## 1. Visão de Produto

Sistema vitalício/local para consultórios odontológicos de 1–3 cadeiras. "Software odontológico" é categoria de busca estabelecida no ML, e o perfil do comprador (dentista/clínica) tem o maior ticket percebido da onda — R$ 149,90 é irrisório frente às mensalidades de R$ 150–400 dos SaaS odontológicos consolidados.

- Público: dentista autônomo ou clínica pequena que não quer mensalidade nem dados na nuvem de terceiros.
- Promessa do anúncio: agenda, pacientes, tratamentos/orçamentos, estoque de materiais, financeiro — pagamento único, offline, dados 100% na máquina do cliente (argumento de privacidade é FORÇA aqui, não fraqueza).

## 2. Estado Atual (auditado na admissão)

- Estrutura: HTML único (`index.html`, ~181 KB) + `assets/` (inclui `libs/lucide.js` e `libs/tailwindcss.js` locais — único da onda que já veio com libs) + `lock.js` + `manifest.json` + `sw.js`.
- Módulos existentes: Dashboard, Agenda (schedule), Pacientes, Tratamentos, Estoque, Financeiro, Relatórios, Configurações, Manual, Sobre.
- Licenciamento: airlock via `lock.js`, contrato antigo da `api_licenca` — realinhar.
- Maturidade: scaffold da matriz com retoques até maio/2026 (data mais recente da onda); ainda assim, 1 commit de desenvolvimento real na origem.

## 3. Posicionamento Comercial (Política oficial)

| plan_code | Canal | Preço | Status no lançamento |
| --- | --- | ---: | --- |
| `ml_lifetime` | Mercado Livre | R$ 149,90 | ✅ produto de entrada (foco deste roadmap) — preço confirmado pelo usuário em 10/08/2026 |
| `direct_lifetime` | Venda direta | R$ 299,90 | previsto — nicho com maior chance de conversão direta da onda |
| `pro_lifetime` | Venda direta Pro | R$ 599,90 | previsto, não ativar agora |
| `premium_monthly` | SaaS Supabase | variável | futuro — só após padrão do piloto Barbearia |

## 4. Fases de Execução

### Fase 0 — Auditoria e higiene
- [ ] Compliance offline (§1 do `docs/CHECKLIST_PUBLICACAO_ML.md`) — libs já são locais, confirmar que o `index.html` não referencia nada externo além delas.
- [ ] `node -c` nos JS; `manifest.json` (ícones 192/512); `sw.js` completo.

### Fase 1 — Padronização de ecossistema
- [ ] Realinhar `lock.js` à `api_licenca_ml.php` atual (caminhos `../api_*`).
- [ ] Registrar no catálogo comercial e painel admin (prateleira + licença `ml_lifetime`).
- [ ] Notificações (filtro pós-ativação) + Central de Evolução 2.0.

### Fase 2 — Lapidação de nicho
- [ ] **Adequação visual ao padrão do ecossistema** (`docs/PADRAO_VISUAL_ECOSSISTEMA.md` v2.0, referência Gestão Gastro): tokens base, acento do nicho **ciano clínico `#0891B2`**, Lucide no lugar de emojis, 8 proibições anti-"cara de IA" verificadas, tema claro/escuro. Critério: screenshot lado a lado com o Gastro deve parecer da mesma família.
- [ ] Ficha clínica do paciente: anamnese simples + histórico de procedimentos por consulta (sem laudo/receita — ver riscos).
- [ ] Orçamento de tratamento: plano de tratamento com itens, valor total e status (proposto/aprovado/em andamento/concluído) — é o coração da venda do dentista.
- [ ] Parcelamento manual do tratamento no financeiro (controle de parcelas pagas/pendentes).
- [ ] Estoque de materiais com alerta de mínimo (resina, luva, anestésico) — já existe módulo, validar profundidade.
- [ ] Avaliar odontograma visual: se custo alto, adiar para `pro_lifetime` — NÃO bloquear a entrada ML por ele.

### Fase 3 — QA e homologação
- [ ] Checklist de publicação ML completo (§1–§4), incluindo conflito de agenda e backup/restauração.
- [ ] Ativação local via `router.php` (`http://127.0.0.1:8000/gestao-odonto/`).

### Fase 4 — Empacotamento e publicação
- [ ] ZIP limpo (§5).
- [ ] Anúncio ML: "Software Odontológico Vitalício — Agenda, Pacientes, Orçamentos e Estoque — Sem Mensalidade". Destacar privacidade local dos dados.
- [ ] Deploy só pós-22h, no pacote em massa.

### Fase 5 — Pós-lançamento
- Métricas de venda; perguntas do anúncio alimentam o backlog do `pro_lifetime` (odontograma, imagens).
- SaaS futuro: agenda online do paciente e lembrete de consulta — após piloto Barbearia.

## 5. Riscos e Dependências

| Risco | Mitigação |
| --- | --- |
| Dados de saúde em localStorage sem criptografia (LGPD — dado sensível) | Herda a decisão pendente de criptografia localStorage/backup da Barbearia (proposta Codex aguardando Arquiteto). Odonto/Terapia são os que mais precisam dela — priorizar aplicação do padrão aqui assim que aprovado. Até lá, anúncio não promete "conformidade LGPD", promete "dados na sua máquina". |
| Expectativa de receituário/assinatura digital (funções reguladas) | Fora de escopo do vitalício — deixar explícito no anúncio o que NÃO faz |
| Concorrência SaaS forte (Amplimed etc.) | Não competir em feature — competir em preço único + offline + privacidade |
| Contrato antigo de licença | Fase 1 obrigatória |

## 6. Critérios de Aceite

1. Checklist de publicação ML 100% verde.
2. Licença `ml_lifetime` ativa o sistema de ponta a ponta.
3. Fluxo completo: paciente → orçamento de tratamento → aprovação → parcelas no financeiro → consulta na agenda.
4. Funciona 100% offline (PWA instalável).
5. Nenhum commit/push/zip/deploy sem autorização explícita do usuário.
