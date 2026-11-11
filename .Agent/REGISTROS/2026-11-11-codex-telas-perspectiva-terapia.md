# Telas em perspectiva e abertura contextual

- Data: 11/11/2026. Agente: Codex. Branch: `main`.
- Origem: responsável pediu capturas como fundo de cada seção, profundidade em perspectiva, remoção das informações da moldura e botão abrindo a tela correspondente.
- Escopo: HTML/CSS do Terapia, parâmetro opcional no carregador compartilhado (compatível com chamadas existentes), entrada contextual exclusiva da demo, versões de cache, testes e registro.
- Estado inicial: alterações anteriores preservadas.
- Critérios: texto legível sobre os fundos, perspectiva adaptável, ausência de molduras/legendas e abertura de Agenda, ficha de Mariana e Financeiro conforme a imagem.
- Status: implementado e conferido localmente. Sem publicação, commit ou push.

## Entrega

- `produtos/gestao-terapia.html`: capturas passaram a fundos de cada artigo; removidas barras, molduras e legendas externas. Cada CTA fornece a rota da tela mostrada.
- `produtos/assets/gestao-terapia.css`: perspectiva estática com borda oposta ao texto avançando visualmente, degradês de leitura e orientação alternada; tablet/celular apresentam a tela ao fundo da parte inferior. Sem animação de parallax.
- `produtos/assets/produtos.js`: carregador compartilhado aceita parâmetros opcionais de consulta, mantendo o comportamento das chamadas existentes sem argumentos. Ajuste necessário para abrir a demo diretamente na área solicitada.
- `tecnologia/demos/gestao-terapia/assets/js/demo-entry.js`: entradas permitidas para Agenda, ficha fictícia de Mariana (`demo_patient_13`) e Financeiro. Entradas desconhecidas são ignoradas.
- `demo-bypass.js`: aplica a entrada depois de aguardar a inicialização dos dados e atualiza o guia da tela.
- `index.html` da demo e `sw.js`: novo módulo e cache v75 com versões atualizadas.
- Criado `tests/therapy-demo-entry.test.js`.

## Validações

- TDD: teste inicial apresentou duas falhas esperadas; após implementação, os três testes da abertura contextual passaram.
- `node --test tests/therapy-demo-entry.test.js tests/therapy-demo-appearance.test.js`: 6 aprovados.
- `node --check`: carregador compartilhado, entrada da demo, bypass e service worker aprovados.
- CSS parseado com PostCSS existente e 31 links/âncoras locais conferidos, sem destinos ausentes; IDs únicos.
- Browser: os três CTAs abriram as áreas corretas no iframe; a ficha exibiu Mariana Castro Figueiredo, conforme captura. Agenda e guia contextual também conferidos após ajuste final.
- Inspeção visual em 1440, 768 e 375 px; medidas em 320 px. Largura de rolagem igual à largura útil nos quatro tamanhos.
- Nenhuma barra/legenda de captura restante e nenhum ícone pendente na conferência final.
- `git diff --check`: aprovado.
- Evidência: `C:/Users/tecno/.codex/visualizations/2026/11/11/01a1ca88-437d-7af2-bde5-db61e35f04fe/terapia-telas-perspectiva.jpg`.

## Limites e próxima etapa

- Testes/build do Hub não executados: não foi alterado.
- Sem mudança em preços, dados clínicos ou operação real. Personalização clara/esmeralda preservada.
- Arquivos alheios preservados; ajuste compartilhado descrito acima faz parte da abertura contextual solicitada.
- Servidor mantido em `http://127.0.0.1:8080/produtos/gestao-terapia.html#modulos` para ajustes do responsável.
