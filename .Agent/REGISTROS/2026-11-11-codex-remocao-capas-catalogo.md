# Remoção das capas de sistemas no catálogo

- Data: 11/11/2026. Agente: Codex. Branch: main.
- Pedido: remover capas dos sistemas de gestão, mantendo o padrão restante do site.
- Escopo: tecnologia/tecnologia.html, tecnologia/style.css e este registro.
- Preservar textos, preços, ícones, links, demos, abas e alterações prévias, inclusive a remoção dos atalhos e o CNPJ.
- Plano: remover onze figuras de capa, retirar CSS exclusivo das imagens e aproximar espaçamento dos demais cards.
- Critérios: onze cards presentes sem imagens de capa, sem espaço vazio reservado; validação responsiva e navegação preservada.
- Status: execução local, sem commit ou push solicitado nesta etapa.

## Handoff

- Concluído localmente: onze capas removidas do HTML; estilos exclusivos de mídia retirados; padding e gap ajustados ao catálogo existente; altura mínima reservada removida.
- Onze cards preservados com ícones, nomes, descrições, preços e ações. Imagens físicas mantidas no projeto.
- PostCSS analisou o CSS sem falhas. Auditoria comercial: 17 páginas, 62 links, zero falhas. git diff --check aprovado.
- UI conferida em 1440, 768, 375 e 320 px sem rolagem horizontal. Ativação por Enter e foco visível conferidos na aba Sistemas de Gestão.
- Sem novas dependências, testes ou build do Hub: mudança estática localizada. Regras de movimento reduzido não alteradas.
- Alterações prévias e alheias preservadas; nenhum ajuste fora do escopo.
- Prévia: http://127.0.0.1:8080/tecnologia/tecnologia.html#segmentos
- Evidência: C:/Users/tecno/.codex/visualizations/2026/11/11/01a1ca88-437d-7af2-bde5-db61e35f04fe/catalogo-sem-capas.jpg
- Sem commit e push nesta etapa; aguardando validação local do responsável.

- Integração autorizada em 11/11/2026: responsável aprovou commit e push dos ajustes do catálogo. CNPJ prévio permanece fora deste commit.
