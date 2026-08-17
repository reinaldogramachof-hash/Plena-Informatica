# Plano de Evolução — Plena Informática

Data: 31/07/2026
Eixos: (1) Processos e Qualidade, (2) Evolução Visual + Sites Premium, (3) Agente IA Gerente do Site.
Referências técnicas: repositório Claude Cookbook (Anthropic).

---

## Eixo 1 — Processos e Qualidade

Objetivo: transformar o repositório em algo auditável e confiável, eliminando processos frágeis que hoje dependem de disciplina manual.

### 1.1 Higiene do repositório (rápido, alto impacto)

- Remover arquivos `.bak.premium` e `.bak.20260215_*` das 29 pastas de `Sistemas_Gestao/` — o git já é o backup.
- Tirar do versionamento os binários grandes: `deploy-plena-atualizado-2026-07-31.zip` (20 MB), `gestao-barbearia.zip`, e avaliar `assets/images/logoplena.svg` (4,7 MB — precisa de otimização).
- Corrigir nomes de arquivo problemáticos: `site_itermediário.html` (typo), `servicos/hub/C:Temptest-output.txt` (lixo de path Windows), duplicidade `demos/ecommerce` vs `demos/e-commerce`.
- Atualizar `.gitignore` para impedir reincidência (zips, .bak, dist quando aplicável).

### 1.2 Qualidade automatizada (referência: scripts/ e pre-commit do Cookbook)

- Criar `scripts/` de validação no padrão do Cookbook: verificação de HTML (links internos, imagens quebradas, títulos/meta), inspirado em `validate_notebooks.py`.
- Verificador de links com Lychee (modelo: `lychee.toml` do Cookbook) cobrindo todas as landing pages e demos.
- Pre-commit hooks (modelo: `.pre-commit-config.yaml` do Cookbook): bloqueio de segredos (detect-secrets), formatação, proibição de arquivos .bak/.zip.
- No Hub React: manter os 53 testes existentes como gate obrigatório + adicionar `npm audit` ao fluxo.
- Teste de contrato já existente (`tests/hero-image-contract.test.js`) vira parte de uma suíte executável única.

### 1.3 Governança de agentes com verificação objetiva (referência: managed_agents/CMA_verify_with_outcome_grader)

- Problema atual: `.Agent/REGISTROS/` acumula ~100 registros narrativos manuais sem critério de verificação — documenta, mas não audita.
- Mudança: cada tarefa de agente passa a ter critérios de aceite objetivos definidos ANTES da execução, e a verificação é feita contra esses critérios (checklist executável, não prosa).
- Consolidar registros históricos em um índice único; registros novos seguem modelo enxuto: objetivo → critérios → evidência de verificação.
- Incorporar padrão de gate humano (referência: `CMA_gate_human_in_the_loop`) para ações de publicação/deploy.

### 1.4 Design system unificado

- `Sistemas_Gestao/_design-system.md` já existe — promover a fonte de verdade visual para TODO o repositório (site institucional, tecnologia, produtos, hub).
- Auditoria de consistência: tipografia, paleta, espaçamentos, componentes de card e CTA entre as páginas.

---

## Eixo 2 — Evolução Visual + Sites Premium

Objetivo: elevar o padrão visual de tudo que o cliente vê e criar a vitrine "Sites Premium" como canal de decisão de compra.
Referência de qualidade: `coding/prompting_for_frontend_aesthetics.ipynb` do Cookbook — princípios de tipografia intencional, hierarquia, motion sutil, e fuga do "visual genérico de IA".

### 2.1 Nova seção "Sites Premium" na página tecnologia (tarefa desta sessão)

- Inserir seção própria em `tecnologia/tecnologia.html`, entre as seções existentes de soluções e processo.
- Formato: galeria de cards premium com preview visual, segmento, destaque de recursos e CTA duplo (navegar no modelo / chamar no WhatsApp).
- Cada card aponta para um modelo navegável completo em `tecnologia/sites-premium/<segmento>/`.

### 2.2 Produção dos modelos premium navegáveis

- Modelos completos (não mockups): multi-seção, responsivos, com identidade própria por segmento.
- Segmentos candidatos (a definir com Reinaldo): advocacia, clínica/saúde, arquitetura/engenharia, imobiliária, restaurante sofisticado, estética premium.
- Padrão de qualidade por modelo: hero de impacto, tipografia display própria, motion discreto (scroll reveal), dark ou light conforme segmento, performance (imagens otimizadas), SEO básico.
- Aproveitar aprendizado das landings existentes (assistencia-pro, barbearia-premium, beleza-spa, gestao-gastro) que já têm fórmula validada.

### 2.3 Revisão visual do funil existente

- Auditoria visual das demos em `tecnologia/demos/` (básico/intermediário/avançado) — hoje há inconsistência de nomenclatura e provável disparidade de acabamento.
- Padronizar cards e CTAs da página tecnologia com o design system unificado (item 1.4).
- Garantir que o caminho de navegação do cliente (tecnologia → modelo → WhatsApp) não tenha becos sem saída.

---

## Eixo 3 — Agente IA "Gerente do Site" (avaliação estruturada)

Objetivo: avaliar a implantação de um agente robusto, construído com o Claude Agent SDK, que atua como gerente operacional do site.
Referências: `claude_agent_sdk/` (chief of staff, SRE agent, observability agent) e `managed_agents/` (operate in production, gate human-in-the-loop, verify with outcome grader).

### O que o agente faria (escopo proposto, em ordem de risco crescente)

1. **Auditor contínuo (baixo risco — início ideal)**
   - Varredura agendada: links quebrados, imagens ausentes, erros de console, mojibake/encoding, consistência de preços contra `../comercial/TABELA-DE-PRECOS-E-FERRAMENTAS.md`.
   - Relatório periódico em formato de registro de governança (automatiza o que o `.Agent/REGISTROS` faz manualmente hoje).
2. **Guardião de qualidade (médio risco)**
   - Roda a suíte de validação (Eixo 1.2) a cada mudança e bloqueia/reporta regressões.
   - Verifica novas páginas contra o design system e os critérios de aceite.
3. **Operador assistido (maior risco — somente com gate humano)**
   - Prepara correções simples (links, textos, encoding) como propostas de mudança que Reinaldo aprova antes de aplicar.
   - Nunca faz deploy autônomo — padrão `CMA_gate_human_in_the_loop` é inegociável aqui.

### Requisitos e custos

- Chave de API Anthropic + ambiente de execução (local agendado ou GitHub Actions).
- Custo estimado: baixo para auditoria agendada (modelo Haiku para varreduras, Sonnet para análises) — estimativa detalhada na fase de PoC.
- Pré-requisito real: Eixo 1 concluído. Um agente operando sobre um repositório sem higiene e sem critérios objetivos de verificação só automatiza a bagunça.

### Fases

1. PoC: agente auditor rodando manualmente, relatório sobre o site atual.
2. Operação assistida: execução agendada + relatórios periódicos.
3. Expansão: propostas de correção com aprovação humana.

---

## Ordem de execução recomendada

1. **Agora (esta sessão):** Eixo 2.1 — seção Sites Premium + primeiros modelos.
2. **Curto prazo:** Eixo 1.1 e 1.2 (higiene + validação automatizada).
3. **Médio prazo:** Eixo 1.3, 1.4 e 2.3 (governança, design system, revisão do funil).
4. **Depois:** Eixo 3 (PoC do agente) — só após o Eixo 1 estar de pé.
