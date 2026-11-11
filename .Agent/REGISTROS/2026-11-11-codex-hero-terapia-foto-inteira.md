# Ajuste da fotografia da hero — Gestão Terapia

- Data: 11/11/2026. Agente: Codex. Branch: `main`.
- Origem: responsável pediu foto inteira e maior transparência no lado da descrição.
- Escopo: somente composição da hero em `produtos/assets/gestao-terapia.css` e este registro.
- Estado inicial: alterações anteriores preservadas.
- Implementação: fotografia em toda a largura da hero com `object-fit: contain`, sem recorte; degradê marfim mais opaco sob o texto e progressivamente transparente no lado direito. No celular, foto inteira em proporção original abaixo do texto, com transição suave no topo.
- Original da foto, conteúdo, planos e demo preservados.
- Status: aplicado e conferido localmente. Sem commit, push ou publicação.
- Validação: inspeção em 1440, 768 e 375 px; medidas em 320 px. Sem overflow horizontal nas medições; proporção original da foto preservada. Bordas superior e inferior suavizadas por máscara CSS no desktop/tablet.
- CSS parseado com PostCSS existente: válido; `git diff --check` aprovado.
- Captura final: `C:/Users/tecno/.codex/visualizations/2026/11/11/01a1ca88-437d-7af2-bde5-db61e35f04fe/terapia-hero-foto-inteira.jpg`.
- Sem testes ou build do Hub, pois a alteração é exclusiva de CSS da landing estática.
- Prévia local mantida em execução para avaliação do responsável.
