# Evolução visual da landing page Gestão Terapia

Data: 11/11/2026. Status: plano aprovado e piloto implementado; aguardando avaliação visual do responsável e ajustes.

## Objetivo

Transformar Gestão Terapia na página piloto do padrão visual das landing pages da Plena: apresentação sóbria, demonstração valorizada, leitura confortável e comparação clara das ofertas. A replicação ocorrerá depois da implementação e aprovação visual deste piloto.

## Diagnóstico

Fontes: HTML e estilos atuais, script compartilhado de produtos, registros de 10/11 e observação da página servida localmente no navegador, em desktop e viewport de 375 × 812.

| Achado | Consequência | Prioridade |
| --- | --- | --- |
| O cabeçalho fixo cobre parte da abertura no celular | O título começa parcialmente encoberto | Alta |
| Título muito dominante, trecho com contorno e descrição extensa | A abertura exige esforço de leitura e compete com a demonstração | Alta |
| Prévia estática com letras pequenas e indicadores sem identificação explícita de dados fictícios | A prova visual do produto perde força e pode parecer uma operação real | Alta |
| Mensagens gerais de dados locais e offline convivem com oferta em nuvem | O visitante não distingue imediatamente as modalidades | Alta |
| Cartões de planos têm descrições e composições de preço diferentes | Comparação entre compra única, compra mais recorrência e assinatura exige releitura | Alta |
| Faixa de benefícios, rotina, módulos e privacidade repetem argumentos | A página fica longa, sobretudo no celular | Média |
| Texto anuncia quatro módulos, mas há três grupos de recursos | A organização editorial não corresponde à estrutura visível | Média |
| Etiqueta “Mais escolhido” não tem evidência comercial no registro anterior | O destaque visual se apoia em uma afirmação não comprovada | Média |
| Rodapé contém apenas identificação da empresa | Pouca continuidade de navegação e vínculo institucional | Média |
| CSS compartilhado contém regras de diversas gerações de layout | Alterações genéricas podem afetar outras landing pages | Alta para a implementação |

Os achados visuais são observações da versão atual. Esta revisão não certifica segurança clínica, disponibilidade dos planos, funcionamento offline ou conformidade jurídica.

## Direção visual recomendada

- Manter o azul do produto e a associação com a Plena. Propor navy `#0F172A`, azul `#2563EB`, texto secundário `#475569`, base clara `#F8FAFC` e superfícies brancas.
- Preservar uma abertura escura, com menos textura e brilho. Usar texto sólido no título e áreas claras para leitura dos recursos e planos.
- Manter Inter; reduzir a quantidade de pesos e padronizar títulos, textos, legendas e botões.
- Usar uma largura de conteúdo consistente, até aproximadamente 1200 px, e espaçamento de seção entre 64 e 88 px no desktop, 40 e 56 px no celular.
- Usar bordas discretas, sombras suaves e raios consistentes entre 12 e 20 px. Ícones acompanham o conteúdo, sem ornamentação repetida.
- Priorizar exemplos reais da interface com base fictícia; fotografias genéricas de consultório não são necessárias para esta proposta.

## Plano de execução

### 1. Cabeçalho e primeira dobra

- Corrigir o afastamento do conteúdo em relação ao cabeçalho em todas as larguras e nas âncoras.
- Simplificar o menu para Rotina, Recursos, Planos e Dúvidas, mantendo acesso ao catálogo e ação de demonstração.
- Tornar a identificação secundária compatível com os três modelos, substituindo a definição restrita de “Sistema Clínico Vitalício”.
- Redimensionar o título: referência inicial de 48–56 px no desktop e 34–38 px no celular, ajustada pelas quebras reais.
- Proposta de chamada: “Mais clareza para a rotina do seu consultório.” Texto de apoio curto apresenta agenda, prontuário e financeiro; uma linha separada explica a escolha entre uso local e nuvem.
- Duas ações claras: “Experimentar demonstração” e “Comparar planos”.
- Aumentar a presença da interface do sistema em relação ao texto. Identificar a amostra como “Demonstração com dados fictícios”; o modal real continua sendo a experiência de teste.

### 2. Rotina e prova do produto

- Apresentar quatro etapas curtas: organizar a agenda, consultar o paciente, registrar a sessão e acompanhar recebimentos.
- Combinar a sequência com uma imagem legível da interface real da demo, capturada com dados fictícios, ou com uma amostra existente claramente identificada.
- Evitar uma sequência inteira de novos cartões de benefícios. Cada bloco precisa acrescentar uma informação.
- No celular, usar composição vertical; não exigir um carrossel horizontal para entender o fluxo.

### 3. Recursos organizados por necessidade

- Reorganizar os recursos existentes em três grupos: Agenda e atendimento; Prontuário e acompanhamento; Financeiro e pacotes.
- Reduzir parágrafos e evitar repetir o mesmo recurso em rotina, faixa de benefícios e módulos.
- Usar títulos descritivos, texto legível e uma hierarquia consistente. Recursos secundários podem aparecer em listas simples.
- Conferir cada descrição contra a demonstração antes de apresentar qualquer nova capacidade.

### 4. Privacidade e modalidades de uso

- Concentrar em um bloco curto as informações sobre cofre local, backup e decisões que permanecem com o profissional.
- Delimitar visualmente quais informações se aplicam à licença local e quais dependem da modalidade contratada.
- Revisar as respostas de offline e armazenamento do FAQ para que não neguem a existência da oferta em nuvem.
- Substituir afirmações absolutas de proteção ou conformidade por descrições verificáveis do funcionamento, sem criar selos ou garantias novas.
- Condições não documentadas da nuvem ficam para confirmação comercial; a revisão visual não as define.

### 5. Comparação dos três planos

- Preservar os preços atualmente apresentados: Essencial R$ 499,90 em pagamento único; licença com agenda online R$ 499,90 + R$ 49,90/mês; Nuvem Completa R$ 129,90/mês.
- Alinhar a ordem dos elementos: modalidade, nome, público indicado, preço e periodicidade, diferenças, ação.
- Mostrar compra única e mensalidade em áreas distintas, com peso visual suficiente para ambas no plano intermediário.
- Alinhar os botões na base dos cartões no desktop; preservar a ordem de leitura no celular.
- Acrescentar uma comparação curta por critérios já declarados: local de uso, dependência de conexão e agenda online, após conferência de cada condição.
- Usar destaque discreto no intermediário. Propor a substituição de “Mais escolhido” por uma descrição factual, como “Com agenda online”.
- Manter implantação opcional e condições de contratação abaixo da grade, sem competir com as três ofertas.

### 6. FAQ, fechamento e rodapé

- FAQ com respostas curtas e específicas por modalidade; hierarquia de títulos e contraste consistentes.
- Fechamento com chamada curta e acesso à demonstração e ao contato.
- Rodapé compacto com identificação da Plena, Início, Catálogo e WhatsApp. Links de termos e privacidade somente para destinos existentes e conferidos.
- Substituir o texto clicável da prévia por botão ou link acessível; padronizar foco visível e interação do modal por teclado.

### 7. Validação e preparação para replicação

- Validar 1440, 768, 375 e 320 px: abertura, menu, amostra, grade de ofertas, FAQ e modal.
- Critérios: título inteiro visível, ausência de rolagem horizontal, preços e botões sem cortes, texto principal legível e alvos de toque de pelo menos 44 px.
- Conferir teclado, retorno de foco do modal, Escape, foco visível e preferência por movimento reduzido.
- Conferir âncoras, CTAs, carregamento da demo e mensagens preparadas do WhatsApp, sem enviar mensagens.
- Executar verificação de sintaxe dos scripts alterados, links locais e `git diff --check`; não há build próprio da landing estática.
- Registrar capturas de antes/depois, resultado das verificações e pendências. A aprovação visual do responsável encerra o piloto.
- Só então extrair padrões reutilizáveis para os demais produtos, preservando suas cores, recursos, preços e quantidade de ofertas.

## Arquivos e limites

Na implementação proposta:

- `produtos/gestao-terapia.html`: estrutura, conteúdo e acessibilidade da página piloto.
- `produtos/assets/gestao-terapia.css`: novo estilo específico, carregado após o compartilhado, para isolar a evolução antes de aprovar a replicação.
- `produtos/assets/gestao-terapia.js`: somente se necessário para interação específica e acessibilidade do piloto; preferir HTML nativo quando suficiente.
- `assets/images/`: apenas eventual captura autorizada da demonstração com dados fictícios.
- Documentação e registros da tarefa.

O CSS e JS compartilhados, as outras dez páginas e o código interno da demonstração não precisam ser editados nesta etapa. Alterações anteriores no workspace serão preservadas. Não são propostas dependências novas ou publicação nesta rodada.

## Sequência de aprovação

1. Aprovação deste plano e da direção visual.
2. Implementação completa do piloto Gestão Terapia.
3. Validação local pelo responsável e ajustes.
4. Aprovação do piloto e definição da replicação para as demais landing pages.

## Prévia atual

Servidor local iniciado com o script existente `tools/local/__local-site-server.mjs` e página aberta com sucesso no navegador:

`http://127.0.0.1:8080/produtos/gestao-terapia.html`

A prévia corresponde ao piloto implementado deste plano. O servidor permanece em execução para a validação solicitada.

## Entrega do piloto

### Evolução aprovada após a primeira avaliação

Em 11/11, o responsável aprovou uma identidade inspirada no ambiente de consultório da fotografia fornecida e no modelo Clínica Vitalis. A direção inicial navy/azul foi substituída por marfim, verde profundo e tipografia serifada nos títulos. A página passou a apresentar recursos em composições editoriais alternadas com capturas reais da demonstração (agenda, acompanhamento e financeiro), usando dados fictícios. As três ofertas e a demo interativa continuam preservadas. O registro detalhado é `.Agent/REGISTROS/2026-11-11-codex-identidade-consultorio-terapia.md`.

### Primeira implementação (histórico)

- Página reestruturada, com CSS e JS exclusivos do Terapia, sem edição dos arquivos compartilhados.
- Preços e caminho da demonstração preservados; comparação das três modalidades e FAQ atualizados.
- Inspeção visual nas larguras de 1440, 768, 375 e 320 px; abertura sem sobreposição do cabeçalho e sem conteúdo escapando horizontalmente nas verificações realizadas.
- Demonstração carregada no modal; Escape e retorno de foco verificados no modal e no menu. FAQ operado por teclado.
- 24 links e âncoras locais conferidos, sem destinos ausentes; um H1, sem IDs duplicados, JSON-LD válido, JS com sintaxe válida e CSS parseado com PostCSS (162 blocos).
- `git diff --check`: aprovado.
- Capturas locais em `C:/Users/tecno/.codex/visualizations/2026/11/11/01a1ca88-437d-7af2-bde5-db61e35f04fe/gestao-terapia-desktop.jpg` e `gestao-terapia-mobile.jpg`.
- Próxima etapa: ajustes indicados pelo responsável; replicação segue pendente de aprovação do piloto.
