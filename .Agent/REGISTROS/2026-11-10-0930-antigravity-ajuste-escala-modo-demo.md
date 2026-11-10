# Registro de Execução - Ajuste de Escala Visual do Modo Demonstração Integral

- **Data/Hora**: 2026-11-10 09:30 BRT
- **Agente**: Antigravity
- **Solicitação**: "Mantenha a faixa de aviso modo demo e diminua um pouco a tela do sistema demo para que no modo demo o sistema aparece integralmente."

---

## 1. Diagnóstico do Problema
- Quando o visitante acionava a demonstração em tela cheia nos produtos (`gestao-fit`, `gestao-odonto`, `gestao-terapia`), a presença da faixa superior de aviso ("Modo demonstração • ... • [Gostei, falar no WhatsApp]") combinada com a escala natural (100%) em monitores comuns de notebook (1366x768 ou 1080p com escala do Windows) causava corte das seções inferiores do dashboard (cards de "Prioridades", "Sua agenda / Horários de hoje" e rodapé de métricas).
- Adicionalmente, o botão de fechamento da janela de demonstração (`.demo-fullscreen-close`) ficava sobreposto ao cabeçalho do sistema demo.

---

## 2. Ações Implementadas

### A. Escala Proporcional Responsiva no Modo Demonstração
- Atualizados os scripts `demo-bypass.js` das soluções de gestão (`gestao-fit`, `gestao-odonto`, `gestao-terapia`) para injetar dinamicamente regras de estilo:
  - Em telas desktop (`@media (min-width: 1024px)`): aplicação de `zoom: 0.88`, permitindo que 100% da interface (menu lateral, cabeçalho e todos os blocos de cartões) caiba integralmente sem cortes ou barra de rolagem forçada.
  - Em telas de menor altura vertical (`@media (min-width: 1024px) and (max-height: 720px)`): escala ajustada para `zoom: 0.82` para garantir enquadramento integral mesmo em notebooks com barra de tarefas e abas de navegador visíveis.
  - Preservação da faixa fixa de aviso no topo (`#plena-demo-banner`), mantendo visualização nítida, botões clicáveis e total visibilidade da marca Plena.
  - Alinhamento da barra lateral (`#sidebar`) para iniciar abaixo da faixa de aviso (`top: 38px; height: calc(100vh - 38px);`).
  - Compactação suave da caixa de guia contextual (`#plena-demo-guide`) para não cobrir áreas informativas do sistema.

### B. Reposicionamento do Botão de Fechar da Demonstração
- Em `produtos/assets/produtos.css`, o botão `.demo-fullscreen-close` foi integrado diretamente à faixa preta superior (`top: 5px; right: 14px; width: 28px; height: 28px; z-index: 9999999;`), liberando completamente o cabeçalho do software e eliminando sobreposições com os botões internos do sistema (como "+ Agendar aula").

---

## 3. Validações Realizadas
- `git diff --check`: 0 erros de formatação ou whitespace.
- Validação sintática via Node.js em todos os arquivos `demo-bypass.js`.
