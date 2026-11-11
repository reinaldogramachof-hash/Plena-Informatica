# Alinhamento dos textos à navbar

- Data: 11/11/2026. Agente: Codex.
- Origem: pedido para alinhar os textos às extremidades dos elementos da navbar no desktop.
- Escopo: CSS exclusivo do Terapia. Conteúdo dos módulos com largura máxima de 1200px, equivalente à área útil da navbar (1248px menos 48px de padding). Removido o padding interno dos textos somente acima de 900px.
- Preservados: fontes, imagens em perspectiva e composição mobile. Ajustado o recuo externo desktop para 24px para sustentar o mesmo alinhamento nas larguras intermediárias.
- Validação: CSS válido via PostCSS e `git diff --check` aprovado. Medidas em 1440px confirmam início do bloco esquerdo em 112,4px e fim dos blocos direitos em 1312,4px, iguais às extremidades úteis da navbar. Em 1100px, diferença inferior a 1px, sem rolagem horizontal.
- Evidência: `C:/Users/tecno/.codex/visualizations/2026/11/11/01a1ca88-437d-7af2-bde5-db61e35f04fe/terapia-alinhamento-navbar.jpg`.
- Status: concluído localmente; sem publicação, commit ou push.
