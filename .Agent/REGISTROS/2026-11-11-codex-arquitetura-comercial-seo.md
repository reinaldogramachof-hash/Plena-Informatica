# Implementação da arquitetura comercial por segmento

- Data: 11/11/2026. Agente: Codex. Branch: `main`.
- Origem: aprovação da direção de SEO e autorização para adaptação do site.
- Objetivo: home como portal, catálogo com entrada por segmento/solução, páginas comerciais de serviços, SEO das páginas de produto e mensuração de intenção.
- Escopo: home, catálogo, portal comercial de sites, novas páginas comerciais, assets isolados, metadados pontuais das landing pages, sitemap e documentação. Preservar URLs e conteúdo de negócio aprovado.
- Colaboração: Antigravity trabalha no visual das landing pages; não alterar seus estilos, scripts ou demos. Nas páginas de produto, limitar a integração a metadados, identificação textual do segmento e navegação relacionada, lendo a versão atual antes de aplicar. Não reverter alterações existentes.
- Entrega local, sem commit, push ou publicação nesta tarefa. Configuração de contas Search Console/GA4 e campanhas depende de acesso externo e não será declarada concluída.
- Implementação: home com três caminhos de solução e 11 segmentos; catálogo com acesso direto aos segmentos e páginas comerciais; portal de sites atualizado; novas páginas de automações, e-commerce e sites para psicólogos; titles/OG/Twitter/breadcrumbs e navegação relacionada em 11 produtos; sitemap com 17 URLs; noindex em 33 entradas de demo/modelos. Scripts, estilos e conteúdo de negócio dos outros agentes preservados, salvo integração pontual dos metadados e navegação declarados.
- Mensuração: fila `plena_commercial_click` com intenção, oferta, caminho e UTMs permitidas. Sem novo rastreador externo, sem textos de WhatsApp/pacientes e sem declarar clique como venda. Guia de configuração das contas e piloto de divulgação documentados.
- Ajuste técnico necessário: quebra do e-mail no rodapé da home corrigiu rolagem horizontal em tablet. `.htaccess` preparado para aliases antigos de landing pages e e-commerce; servidor estático local não interpreta Apache.
- Validação: 17 páginas comerciais e 76 links auditados sem falhas; 14 testes aprovados; CSS via PostCSS, JS válido e `git diff --check` aprovado. Home, catálogo, portal de sites e três novas páginas conferidos em 1440, 768, 375 e 320px; problema de overflow da home em 768px corrigido e revalidado. Foco por teclado, FAQ, menu do portal de sites e caminho catálogo → Terapia conferidos.
- Evidências: `plena-portal-segmentos.jpg`, `plena-catalogo-segmentos.jpg` e `plena-catalogo-mobile.jpg` em `C:/Users/tecno/.codex/visualizations/2026/11/11/01a1ca88-437d-7af2-bde5-db61e35f04fe/`.
- Documentação: `docs/estrategia/ARQUITETURA-COMERCIAL-SEO-2026-11-11.md`; auditoria repetível em `tools/local/audit-commercial-seo.mjs`.
- Limites: sem confirmação de indexação, ranking, coleta efetiva no GA4 ou respostas dos redirecionamentos Apache em produção; dependem de publicação autorizada e acesso às contas.
- Status: concluído localmente para validação. Servidor mantido em http://127.0.0.1:8080/. Sem commit, push ou publicação.
