# Registro de ação

- Data: 11/11/2026.
- Agente: Codex.
- Branch: `main`.
- Solicitação: aplicação do plano visual aprovado para Gestão Terapia.
- Escopo: `produtos/gestao-terapia.html`, novos CSS/JS exclusivos do piloto, plano e este registro.
- Estado inicial: mudanças anteriores em CSS compartilhado, Fit, Odonto e Terapia; preservadas. Servidor local da tarefa anterior na porta 8080.
- Critérios: plano implementado, preços preservados, demo acessível e validação responsiva em 1440, 768, 375 e 320 px.
- Status: implementado para validação local. Sem publicação, commit ou push.

## Entrega

- `produtos/gestao-terapia.html`: nova abertura, amostra fictícia identificada, fluxo em quatro etapas, três grupos de recursos, privacidade por modalidade, três planos com comparação, FAQ e rodapé.
- `produtos/assets/gestao-terapia.css`: estilos exclusivos, responsividade e preferência por movimento reduzido.
- `produtos/assets/gestao-terapia.js`: foco de menu/modal, isolamento do fundo com inert, estado acessível do menu e rótulos da comparação no celular.
- Plano atualizado com status de implementação.
- Preços, carregador compartilhado e URL da demonstração preservados. Os arquivos de implementação compartilhados e as outras páginas não foram editados pelo Codex nesta tarefa.

## Verificações realizadas

| Verificação | Resultado |
| --- | --- |
| Browser: 1440, 768, 375 e 320 px | Inspeção visual realizada; título visível sob cabeçalho, composição adaptada |
| Browser: 1440, 375 e 320 px | Medições sem conteúdo de main ultrapassando a viewport; scrollWidth igual à largura útil nas medições |
| Planos no desktop | Botões e divisórias alinhados, três ofertas presentes e preços preservados |
| Ícones na landing | Nenhum i[data-lucide] pendente nas verificações |
| Menu | Foco no fechamento, Escape e retorno ao botão de abertura verificados |
| Demonstração | Carregou visão geral real da Clínica Horizonte; Escape pelo controle de fechar e retorno de foco verificados |
| FAQ | Abertura por Enter verificada |
| Links/âncoras locais | 24 conferidos, nenhum destino ausente |
| IDs, H1 e dados estruturados | Sem IDs duplicados; um H1; JSON-LD válido |
| node --check produtos/assets/gestao-terapia.js | Aprovado |
| CSS via PostCSS existente no Hub | 162 blocos válidos |
| git diff --check | Aprovado |

Tentativas de automação de Escape dentro do iframe não localizaram os controles internos pela API; esse caminho específico não foi homologado. O listener foi previsto para a origem local, e o controle de fechar da página foi validado. Não foram enviadas mensagens pelo WhatsApp.

## Testes e limites

- Verificação de comportamento feita no navegador e checagens estáticas; sem nova suíte automatizada para a mudança visual.
- Sem build próprio para a landing estática; testes/build do Hub não executados porque ele não foi alterado.
- Capturas desktop/mobile salvas na pasta de visualizações da sessão; diferenças visuais disponíveis na prévia local.
- Conteúdo descreve modalidades já existentes na página; condições comerciais da nuvem continuam direcionadas ao atendimento.

## Teste local e próxima etapa

- Abrir `http://127.0.0.1:8080/produtos/gestao-terapia.html` (servidor mantido ativo).
- Conferir abertura, recursos, três ofertas, comparação, FAQ e demonstração.
- Aguardar ajustes do responsável. Replicação para demais produtos não iniciada.
- Ajustes fora do escopo: nenhum.
