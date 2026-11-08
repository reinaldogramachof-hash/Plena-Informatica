# Registro de Ação: Evolução Visual Clean & Dual-Tone (Gestão Terapia Pro & Gestão Odonto Pro)

**Data**: 2026-11-08  
**Agente**: Antigravity (Google DeepMind)  
**Contexto**: Solicitação do usuário para revisão visual ampla das duas landing pages (`produtos/gestao-terapia.html` e `produtos/gestao-odonto.html`), adotando conceito clean com fundos mesclados entre o tom de cada sistema clínico (azul para Terapia e ciano para Odonto) e o branco/luz, além de reorganização da hierarquia da informação e fluxo de navegação facilitado.

---

## 1. Escopo das Alterações

### A. Arquitetura Visual Dual-Tone em `produtos/assets/produtos.css`
- **Fundo Mesclado & Clean**: Implementação da classe base `.clinical-light-section`, que mescla fundo luminoso off-white (`#F8FAFC` a `#FFFFFF`) com gradientes radiais suaves derivados do tom de cada sistema (`rgba(37,99,235,.05)` para Terapia e `rgba(8,145,178,.05)` para Odonto).
- **Tipografia de Alto Contraste**: Títulos `h2`, `h3`, `h4` em grafite profundo (`#0F172A`) e corpos de texto em ardósia elegante (`#334155` e `#475569`).
- **Cards Brancos de Alto Padrão**: Criação de `.clinical-white-card` com fundo `#FFFFFF`, bordas sutis `#E2E8F0`, sombras refinadas e microinterações de hover no tom do sistema.
- **Componentes Especializados**:
  - `.clinical-trust-strip`: Barra de confiança com 4 selos de credibilidade logo abaixo do Hero.
  - `.clinical-routine-grid` e `.clinical-routine-card`: Apresentação sequencial da rotina em 4 passos numerados (`01` a `04`).
  - `.clinical-modules-cluster`: Grupos temáticos dos módulos clínicos com cabeçalhos com ícones e badges.
  - `.clinical-ethics-box`: Bloco comparativo claro entre o que o sistema entrega com excelência vs. limites éticos e proteção de sigilo.
  - `.clinical-price-card-clean`: Card de licenciamento vitalício clean em destaque, ressaltando o custo-benefício de zero mensalidades.
  - `.clinical-faq-list`: Accordion claro com cards independentes para cada pergunta.

### B. Refatoração de `produtos/gestao-terapia.html`
- **Hero Imersivo**: Visual com mockup interativo do dia a dia do consultório (Dra. Marina Duarte), status de atendimento, KPIs e atalhos rápidos para demonstração real e WhatsApp.
- **Faixa de Credibilidade**: 4 destaques: 100% no Computador, Licença Vitalícia sem mensalidade, Funciona sem Internet (PWA) e Sigilo Profissional (LGPD/Cofre AES-GCM).
- **Rotina em 4 Etapas**:
  1. Agenda & Intervalo Clínico
  2. Prontuário em 10 Painéis
  3. Sessão com Rascunho Seguro
  4. Instrumentos (PHQ-9/GAD-7) & Financeiro
- **Módulos do Consultório em Cards Brancos**:
  1. Atendimento Clínico & Agenda
  2. Prontuário, Escalas & Documentos
  3. Gestão Financeira, Pacotes & Relatórios
- **Critérios Éticos & Guardrails**: Transparência sem diagnósticos automáticos por IA ou mensagens invasivas.
- **Preço**: Destaque para Licença Vitalícia de R$ 499,90 e opção de Implantação Orientada.
- **FAQ & Fechamento**: 5 respostas diretas e CTA final de alta conversão.

### C. Refatoração de `produtos/gestao-odonto.html`
- **Hero Imersivo**: Visual com mockup da cadeira da Clínica OdontoPlena (Dr. Lucas Silveira · CRO-SP 108.432), consultas agendadas, tratamentos em curso e estoque de insumos.
- **Faixa de Credibilidade**: 4 destaques específicos para o consultório odontológico.
- **Rotina Odontológica em 4 Etapas**:
  1. Recepção & Triagem
  2. Anamnese & Prontuário
  3. Procedimentos & Orçamento por Dente
  4. Baixa, Parcelas & Reposição de Insumos
- **Módulos Odontológicos em Cards Brancos**:
  1. Agenda Clínica & Atendimento na Cadeira
  2. Prontuário, Anamnese & Orçamentos
  3. Gestão Financeira, Reposição de Insumos & Livro Caixa
- **Critérios Éticos & Guardrails Odonto**: Respeito à autonomia técnica do cirurgião-dentista, sem laudos automáticos e dados sob custódia local.
- **Preço**: Licença Vitalícia de R$ 299,90 sem mensalidades.
- **FAQ & Fechamento**: 5 respostas objetivas e CTA final de fechamento.

---

## 2. Validações Realizadas
- `git diff --check`: 0 pendências ou erros de whitespace.
- IDs de âncoras (`#rotina`, `#modulos`, `#privacidade`, `#plano`, `#faq`) totalmente sincronizados na barra de navegação, mobile menu e seções.
- Responsividade: Layout testado para desktop (1280px+), tablet (991px) e mobile (<767px).
- Codificação: Preservação estrita de UTF-8 sem caracteres corrompidos.

