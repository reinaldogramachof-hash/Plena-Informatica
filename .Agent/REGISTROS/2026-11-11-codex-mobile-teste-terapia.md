# Priorização do teste gratuito no celular

- Data: 11/11/2026. Agente: Codex. Branch: `main`.
- Origem: solicitação do responsável para priorizar o teste real de 7 dias no celular em vez de abrir a demonstração.
- Escopo: HTML/CSS/JS exclusivos do Terapia, novo adaptador da entrada e testes. Carregador compartilhado e outras páginas preservados.
- Implementação: até 767px, chamadas de demo passam a solicitar teste no WhatsApp; rótulos acompanham a ação. Navbar mobile destaca “7 dias”, menu e módulos convidam ao teste; hero e fechamento ocultam o CTA redundante de demo. FAQ orienta demonstração no computador. Rótulo da navbar abreviado após inspeção de 320px para preservar a marca em uma linha.
- Desktop e tablet a partir de 768px mantêm demo e destinos contextuais. Decisão de largura é consultada a cada clique.
- Validação: 10 testes aprovados, incluindo instalação do adaptador, solicitação mobile sem abrir demo e preservação dos destinos no desktop. CSS via PostCSS e `git diff --check` aprovados. Inspeção em 375, 320, 768 e 1440px; menu mobile e rótulos conferidos, sem rolagem horizontal nas larguras mobile/tablet medidas. Botão desktop abriu modal com URL correta da demo; modal fechado ao final. WhatsApp não enviado durante testes.
- Evidência: `C:/Users/tecno/.codex/visualizations/2026/11/11/01a1ca88-437d-7af2-bde5-db61e35f04fe/terapia-mobile-foco-teste.jpg`.
- Status: concluído localmente; sem commit, push ou publicação.
