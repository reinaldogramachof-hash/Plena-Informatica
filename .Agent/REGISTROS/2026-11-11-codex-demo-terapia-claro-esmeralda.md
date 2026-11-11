# Padrão visual da demonstração — claro e esmeralda

- Data: 11/11/2026. Agente: Codex. Branch: `main`.
- Origem: padronizar demonstração e capturas da landing com fundo branco e detalhes esmeralda já disponíveis na personalização do produto.
- Escopo: tema inicial e base fictícia da demo Terapia, cache correspondente, três capturas e seus links na landing; testes e registros.
- Estado inicial: alterações anteriores preservadas. Sem edição de outros sistemas.
- Critério: demo abre clara/esmeralda inclusive após preferências antigas; personalização continua disponível durante a sessão; capturas refletem a demo real.
- Status: aplicado e validado localmente. Sem publicação, commit ou push.

## Implementação

- `assets/js/theme.js` da demo inicia cada abertura com tema claro e a paleta nativa `emerald` (`#047857`), sem remover os controles de personalização durante a sessão. Funciona também sem localStorage disponível.
- `assets/js/demo-seed.js` usa emerald e `demo-bypass.js` normaliza a paleta de bases fictícias de sessões anteriores. Dados e demais preferências são preservados.
- Barra e guia da demonstração passaram a consumir as variáveis nativas de superfície, texto e destaque, acompanhando a personalização em vez de fixar preto/azul.
- `index.html` da demo inicia sem classe dark; versões de tema e bypass e metadado de cor atualizados.
- `sw.js`: cache v72 e assets atualizados para evitar scripts antigos.
- Refeitas as três capturas reais, com dados fictícios: agenda, acompanhamento e financeiro. A landing referencia imagens com `?v=2` nos previews e links de ampliação.
- Nenhuma mudança nos preços, hero, outros produtos ou regras operacionais/clínicas do sistema.

## Verificações

- TDD: primeira execução do teste apresentou duas falhas esperadas (modo antigo escuro/azul); após implementação, três testes passaram.
- `node --test tests/therapy-demo-appearance.test.js`: 3 aprovados; cobre preferência antiga, personalização durante a sessão e armazenamento indisponível.
- `node --check` nos scripts theme.js, demo-bypass.js e sw.js: aprovado.
- Demo direta e aberta pelo modal da landing: aparência clara e verde esmeralda confirmada no navegador.
- Paleta computada inicial: `#047857`; classe dark ausente.
- Três imagens atualizadas carregadas na landing; 34 links/âncoras locais válidos.
- Fechamento do modal por Escape verificado.
- `git diff --check`: aprovado.
- Captura final: `C:/Users/tecno/.codex/visualizations/2026/11/11/01a1ca88-437d-7af2-bde5-db61e35f04fe/terapia-telas-claro-esmeralda.jpg`.
- Sem execução de testes/build do Hub; alteração localizada na demo estática e seus assets.
- Ajustes fora do escopo: nenhum. Servidor local mantido para o responsável avaliar.
