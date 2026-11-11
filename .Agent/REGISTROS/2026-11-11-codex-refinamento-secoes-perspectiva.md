# Refinamento dos blocos com fundos em perspectiva

- Data: 11/11/2026. Agente: Codex. Branch: `main`.
- Origem: pedido de organizar as imagens de fundo e definir melhor os limites entre as seções.
- Escopo: CSS exclusivo do Terapia e este registro; conteúdo, imagens, demo e navegação contextual preservados.
- Estado inicial: alterações anteriores preservadas.
- Objetivo: delimitar os três blocos com respiro, enquadramento uniforme e transições suaves da imagem, mantendo profundidade e legibilidade.
- Implementação: respiro de 32px entre blocos (20px no celular), contorno sutil, cantos arredondados e enquadramento interno uniforme. Máscaras verticais suavizam as extremidades das telas e os gradientes mantêm o destaque do texto. Perspectiva preservada com adaptação para tablet e celular.
- Validação: CSS analisado com PostCSS e `git diff --check` sem erros. Conferência visual em 1440, 768, 375 e 320px, sem rolagem horizontal do documento.
- Evidência: `C:/Users/tecno/.codex/visualizations/2026/11/11/01a1ca88-437d-7af2-bde5-db61e35f04fe/terapia-secoes-refinadas.jpg`.
- Status: concluído localmente; servidor mantido em http://127.0.0.1:8080/produtos/gestao-terapia.html. Sem publicação, commit ou push.
