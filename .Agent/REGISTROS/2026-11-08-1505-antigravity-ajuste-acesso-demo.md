# Registro de Execução - Ajuste do Acesso às Demonstrações dos Sistemas de Gestão

- **Data/Hora**: 2026-11-08 15:05 BRT
- **Agente**: Antigravity
- **Solicitação**: "AJUSTE O ACESSO AO DEMO."

---

## 1. Motivação e Diagnóstico
- As demonstrações dos sistemas de gestão (`gestao-terapia`, `gestao-odonto` e `gestao-fit`) continham mecanismos originais de verificação de licença remota (`lock.js`) que realizavam chamadas assíncronas para o endpoint inexistente `api_licenca_ml.php`.
- Em caso de falha de conexão na verificação de licença, o sistema exibia a tela de ativação de chave (`#view-login`) ou o modal de recibo (`#welcome-receipt-modal`), impedindo a exploração imediata em 1 clique pelo visitante.
- Além disso, no `gestao-fit`, o módulo de cofre criptográfico (`FitVaultStore` / `FitSecurity`) bloqueava o DOM com a classe `fit-data-locked` e exigia criação ou inserção de senha de cofre local antes de expor os dados.
- Faltava também um botão direto de acesso à demonstração na barra de navegação superior (navbar) fixa das novas landing pages de produto, facilitando a abertura imediata tanto no desktop quanto no mobile.

---

## 2. Ações Implementadas

### A. Neutralização dos Gates de Licença (`lock.js`)
- **`tecnologia/demos/gestao-odonto/lock.js`**: `checkStatus()` atualizado para chamar `unlockSystem()` incondicionalmente sem requisição externa; `unlockSystem()` garante `login.style.display = 'none'` e oculta `#welcome-receipt-modal`.
- **`tecnologia/demos/gestao-terapia/lock.js`**: `checkStatus()` atualizado para chamar `unlockSystem()` diretamente; `unlockSystem()` garante `login.style.display = 'none'` e oculta `#welcome-receipt-modal`.
- **`tecnologia/demos/gestao-fit/lock.js`**: `checkStatus()` atualizado para chamar `unlockSystem()` diretamente sem requisições HTTP e sem bloquear telas.

### B. Bypass Transparente do Cofre e Seed Automático (`gestao-fit`)
- **`tecnologia/demos/gestao-fit/demo-bypass.js`**:
  - Interceptação das rotinas `FitVaultStore.create` e `FitSecurity.open` para responder imediatamente como cofre já aberto com a base de demonstração (`window.PLENA_DEMO_FIT_SEED`).
  - Neutralizado o diálogo de senha (`.fit-security-overlay` e `#fit-security-dialog`).
- **`tecnologia/demos/gestao-fit/index.html`**:
  - Carregamento prioritário de `demo-seed.js` e `demo-bypass.js` no topo da `<head>`.
  - Remoção da classe bloqueadora `fit-data-locked` da tag `<body>`.

### C. Acesso Unificado e Imediato nas Landing Pages e Catálogo
- **`tecnologia/tecnologia.html`**:
  - Parâmetros dos botões "Ver demo" alinhados com o caminho explícito do arquivo (`demos/gestao-terapia/index.html`, `demos/gestao-odonto/index.html`, `demos/gestao-fit/index.html`).
- **`produtos/gestao-terapia.html`**, **`produtos/gestao-odonto.html`** e **`produtos/gestao-fit.html`**:
  - Adicionado botão de ação rápida "Testar Demo" com ícone `monitor-up` na barra de navegação superior (navbar) fixa para desktop.
  - Adicionado botão de ação compacta "Demo" e item de menu mobile para acesso em 1 toque em dispositivos móveis.

---

## 3. Validações Realizadas
- `git diff --check`: 0 pendências ou erros de whitespace.
- Validação sintática em Node.js de todos os scripts `demo-seed.js`, `demo-bypass.js` e `lock.js`.
- Verificação da integridade de seletores de modal (`#demo-modal`, `#demo-frame`) em todas as páginas de produto.
