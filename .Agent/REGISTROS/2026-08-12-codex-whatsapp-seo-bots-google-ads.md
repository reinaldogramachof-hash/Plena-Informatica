# Registro de acao

- Data: `2026-08-12`
- Agente: Codex
- Area: Site institucional / SEO / WhatsApp / preparacao Google Ads
- Status final: implementado localmente, validado em build/lint/teste focado, sem commit/push.

## Objetivo

Padronizar os contatos de WhatsApp do site para o numero informado pelo
responsavel, melhorar sinais tecnicos de rastreamento e indexacao, e preparar a
base publica para analise posterior de Google Meu Negocio, WhatsApp Business e
campanhas Google Ads.

## Numero padronizado

- Visivel: `(12) 9929-1018`
- Links e dados estruturados: `551299291018`
- Telefone estruturado: `+551299291018`

## Ajustes aplicados

- Atualizados links de WhatsApp em paginas institucionais, paginas comerciais,
  modelos de landing page, demos e scripts compartilhados.
- Atualizado o helper do Hub em `servicos/hub/src/app/whatsapp.ts`.
- Atualizado fixture do teste de QR Code para refletir o numero atual.
- Regenerado o build publicado em `servicos/hub-app`.
- Criado `robots.txt` apontando para o sitemap oficial.
- Criado `sitemap.xml` com 15 URLs publicas prioritarias.
- Criado `.htaccess` com redirecionamentos 301 para URLs limpas que hoje devem
  apontar para paginas reais `.html` ou para os caminhos corretos de modelos.
- Corrigidos canonicals, `og:url` e URLs de JSON-LD em paginas com mismatch
  tecnico identificado.

## Rotas e SEO

- `servicos/servicos.html` agora usa canonical/OG real.
- `tecnologia/tecnologia.html` agora usa canonical/OG/JSON-LD real.
- Paginas de produtos usam canonical com `.html`, alinhado ao arquivo publicado.
- `blog/index.html` foi alinhado para `/blog/`.
- Modelos de landing page foram alinhados ao caminho real em
  `/tecnologia/modelos/landing-pages/...`.

## Legado do Hub

O caminho antigo `servicos/ferramentas/qr-code/` foi conferido. O `index.html`
desse caminho ja e um redirecionamento leve para `../../hub-app/`, portanto a
entrada publica nao carrega o bundle antigo. Foram preservados assets historicos
nao referenciados para evitar remocao destrutiva fora do necessario.

## Validacoes executadas

| Validacao | Resultado |
| --- | --- |
| `npm.cmd run test -- src/features/tools/qr-code/domain/qr-payload.test.ts` | 1 arquivo, 9 testes aprovados |
| `npm.cmd run test` em `servicos/hub` | 53 arquivos; 451 testes aprovados, 1 falhou por timeout fora do escopo |
| `npm.cmd run lint` em `servicos/hub` | aprovado |
| `npm.cmd run build` em `servicos/hub` | aprovado; `servicos/hub-app` regenerado |
| `git diff --check` | aprovado, com avisos de CRLF em arquivos ja trabalhados |
| Auditoria de residuos em fontes HTML/JS/TS/MD principais | sem ocorrencias de numeros antigos no escopo rastreado |
| Conferencia do sitemap | 15 URLs carregadas pelo XML |

## Fora do escopo desta etapa

- A suite completa do Hub reencontrou 1 falha em
  `src/features/tools/label-generator/domain/create-labels-pdf.test.ts`: timeout
  de 15000ms em `retorna Uint8Array nao vazio para uma etiqueta`. Nao houve
  alteracao no gerador de etiquetas nesta rodada.
- Google Meu Negocio e WhatsApp Business foram analisados em etapa live
  posterior, registrada em
  `.Agent/REGISTROS/2026-08-12-codex-auditoria-live-google-whatsapp.md`.
- Nao houve commit, push ou publicacao.

## Proxima etapa recomendada

Com as abas abertas, conferir:

- Consistencia de nome, telefone, categoria, endereco/area de atendimento e
  horario no Google Meu Negocio.
- Se o WhatsApp Business exibe o mesmo numero e dados comerciais do site.
- Se os CTAs do site levam para conversa com mensagem coerente por pagina.
- Se as extensoes/ativos do Google Ads devem usar o telefone, sitelinks e
  landing pages agora padronizados.
