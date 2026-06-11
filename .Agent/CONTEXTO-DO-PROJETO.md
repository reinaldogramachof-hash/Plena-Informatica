# Contexto do projeto

Atualizado em: 11 de junho de 2026.

## Produto

Este repositório reúne o site institucional da Plena Informática, páginas de
serviços, produtos personalizados, soluções de tecnologia, demonstrações de
sistemas e o Hub de Soluções Digitais.

## Áreas principais

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` | Página inicial institucional |
| `personalizados/` | Produtos e serviços personalizados |
| `tecnologia/` | Soluções de tecnologia |
| `produtos/` | Páginas de produtos digitais |
| `Sistemas_Gestão/` | Demonstrações de sistemas por segmento |
| `servicos/` | Vitrine de serviços e documentação do Hub |
| `servicos/hub/` | Aplicação React das ferramentas e painel administrativo |

## Documentos de referência

- `README.md`: visão geral e comandos.
- `TABELA-DE-PRECOS-E-FERRAMENTAS.md`: serviços, preços e oportunidades.
- `servicos/ROADMAP.md`: estado atual e pacotes funcionais do Hub.
- `servicos/docs/ARCHITECTURE.md`: arquitetura.
- `servicos/docs/SECURITY.md`: segurança.
- `servicos/docs/SUPABASE.md`: regras de integração Supabase.
- `servicos/docs/DEVELOPMENT.md`: desenvolvimento local.
- `HANDOFF-CODEX-PAINEL-ADMIN.md`: contexto histórico do painel.

Relatórios históricos ajudam na orientação, mas devem ser conferidos contra o
código atual.

## Stack do Hub

- React;
- TypeScript;
- Vite;
- Vitest e Testing Library;
- `pdf-lib`;
- `qrcode`;
- Zod;
- Supabase apenas nas áreas autorizadas.

## Diretrizes de produto

- ferramentas públicas devem funcionar sem conta sempre que possível;
- processamento de arquivos deve ocorrer localmente;
- a ação gratuita da ferramenta é prioritária;
- serviços profissionais são extensões opcionais;
- textos fiscais, jurídicos ou trabalhistas devem ser orientativos;
- preços públicos só podem vir do documento-base aprovado;
- o projeto é usado em desktop e dispositivos móveis.

## Comandos principais

```powershell
cd servicos\hub
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

No Windows, usar `npm.cmd` quando a política de execução bloquear `npm.ps1`.
