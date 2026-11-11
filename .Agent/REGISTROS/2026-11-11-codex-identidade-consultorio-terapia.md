# Implementação da identidade de consultório — Gestão Terapia

- Data: 11/11/2026.
- Agente: Codex. Branch: `main`.
- Origem: aprovação da direção visual baseada na fotografia fornecida e na referência Clínica Vitalis.
- Escopo: HTML, CSS e JS exclusivos de Terapia; fotografia fornecida e capturas fictícias da demo em `assets/images/terapia/`; registros.
- Arquivos compartilhados, demais produtos e código interno da demo reservados e preservados.
- Estado inicial: alterações anteriores em produtos e registros mantidas; sem descarte.
- Critérios: linguagem de consultório em toda a página, recursos ligados às telas reais, três ofertas preservadas e validação responsiva.
- Status: implementado para avaliação e ajustes do responsável. Sem publicação, commit ou push.

## Entrega

- Abertura editorial com fotografia fornecida, marfim, verde profundo e títulos DM Serif Display; informações funcionais mantidas em Inter.
- Recursos apresentados por três momentos reais: agenda, acompanhamento do paciente e financeiro.
- Capturas realizadas navegando na demo local com base fictícia da Clínica Horizonte; imagens completas e opção “Ampliar tela”. Nenhum paciente real ou serviço externo envolvido.
- Privacidade em verde profundo; planos, FAQ e fechamento com a mesma linguagem do ambiente.
- Preços e três modalidades preservados, assim como scripts de carregamento e código interno da demonstração.
- Fotografia copiada integralmente, sem alteração do original, para `assets/images/terapia/consultorio.jpg`.

## Arquivos

- Modificados: `produtos/gestao-terapia.html` e `produtos/assets/gestao-terapia.css`.
- Criados: `assets/images/terapia/consultorio.jpg`, `agenda-demo.jpg`, `acompanhamento-demo.jpg`, `financeiro-demo.jpg`, e este registro.
- Registros de decisões, feedback e plano atualizados.
- JS específico e arquivos compartilhados não foram modificados nesta rodada.

## Validações

| Verificação | Resultado |
| --- | --- |
| Página em 1440, 768, 375 e 320 px | Inspeção visual concluída |
| Abertura / medidas de overflow | Título abaixo do cabeçalho e largura de rolagem igual à largura útil; nenhum elemento de main ultrapassando a viewport nas medições |
| Imagens e ícones | Quatro imagens carregadas; nenhuma tag Lucide pendente |
| Preços e botões dos planos | Preços mantidos; botões alinhados no desktop |
| Menu | Abriu, fechou por Escape e retornou foco ao acionador |
| Demonstração | Carregou a visão geral; Escape fechou pelo controle externo e devolveu foco a Conhecer o sistema |
| Links/âncoras locais | 34 conferidos, nenhum destino ausente |
| Estrutura | Um H1, nenhum ID duplicado, JSON-LD válido |
| CSS via PostCSS existente no projeto | 202 blocos válidos |
| node --check produtos/assets/gestao-terapia.js | Aprovado |
| git diff --check | Aprovado |

## Evidências e limites

- Capturas finais em `C:/Users/tecno/.codex/visualizations/2026/11/11/01a1ca88-437d-7af2-bde5-db61e35f04fe/terapia-consultorio-desktop.jpg` e `terapia-consultorio-mobile.jpg`.
- Verificações visuais e estáticas adequadas à mudança; não foi executada a suíte/build do Hub, que não foi alterado.
- A foto é ambientação de referência e não é apresentada como sede da Plena.
- Sem alteração das funcionalidades do sistema, envio de mensagens, nova dependência ou publicação.
- Ajustes fora do escopo: nenhum.
- Servidor local mantido: `http://127.0.0.1:8080/produtos/gestao-terapia.html`.
- Próxima etapa: ajustes indicados pelo responsável; outras landing pages permanecem fora desta implementação.
