# Padronizacao de UI e UX dos Servicos Digitais Plena

## Objetivo

Criar uma experiencia coerente entre a vitrine de ferramentas em
`servicos/servicos.html` e as paginas internas do Hub React, priorizando:

- entendimento rapido do que cada ferramenta resolve;
- uso confortavel em celulares;
- confianca sobre privacidade e processamento local;
- consistencia visual entre ferramentas atuais e futuras;
- conexao discreta entre recursos gratuitos e servicos profissionais da Plena;
- manutencao simples de precos, categorias, status e chamadas para acao.

## Direcao aprovada

A direcao visual principal sera a opcao B, orientada por beneficios. A opcao C
sera usada como extensao comercial apenas nas ferramentas que possuam um servico
profissional correspondente.

Isso cria dois tipos de card:

1. **Card de ferramenta autonoma:** explica resultado, beneficios, privacidade e
   tempo estimado, com um unico CTA principal.
2. **Card de ferramenta assistida:** mantem o mesmo padrao, mas inclui uma ponte
   secundaria para atendimento ou servico profissional.

O CTA da ferramenta permanece sempre como acao principal. A oferta profissional
nao deve bloquear, interromper nem parecer condicao para usar a ferramenta.

## Principios de experiencia

### Clareza antes do clique

Cada card deve responder, nesta ordem:

1. O que a ferramenta faz?
2. Qual resultado o usuario recebe?
3. O processamento e local?
4. Precisa de cadastro?
5. Quanto tempo costuma levar?
6. Existe atendimento profissional relacionado?

Descricoes devem ser curtas. Beneficios devem usar linguagem concreta, como
"Baixe em PDF", "Sem cadastro" e "Arquivos nao saem do aparelho".

### Hierarquia de acoes

- CTA primario: iniciar ou usar a ferramenta.
- CTA secundario opcional: conhecer atendimento profissional.
- Link terciario opcional: detalhes, formato ou politica de privacidade.
- Nunca apresentar dois botoes com o mesmo peso visual.
- Ferramentas em construcao nao devem simular disponibilidade; o CTA permanece
  desabilitado e deve informar o estado de forma textual.

### Mobile first

- Um card por linha abaixo de 600 px.
- Area clicavel minima de 44 por 44 px.
- CTA primario ocupa toda a largura no celular.
- Beneficios reduzem de tres para no maximo dois no celular.
- Metadados menos importantes podem ser ocultados, mas privacidade, preco e
  natureza gratuita ou paga nunca podem desaparecer.
- Nenhum texto deve depender de hover.
- Cards nao devem usar altura fixa; o rodape permanece alinhado com flexbox.

### Confianca e transparencia

- "Processamento local" deve ser explicado como beneficio, nao apenas como selo.
- Valores devem indicar claramente se representam ferramenta, impressao ou
  atendimento profissional.
- Servicos pagos devem usar textos como "Atendimento Plena a partir de..." ou
  "Servico profissional relacionado", evitando confusao com cobranca da
  ferramenta gratuita.
- Conteudos fiscais, juridicos ou contabeis preservam seus avisos obrigatorios.
- Nenhuma informacao sensivel deve ser solicitada para apresentar preco ou abrir
  o contato comercial.

## Anatomia padrao do card

### Cabecalho

- selo de estado ou beneficio principal;
- categoria curta;
- icone consistente com a familia visual Plena.

### Conteudo

- titulo;
- descricao de uma ou duas linhas;
- ate tres beneficios objetivos no desktop;
- ate dois beneficios no mobile.

### Rodape

- metadados essenciais: formato, tempo estimado, cadastro ou processamento;
- CTA primario;
- bloco comercial opcional e visualmente secundario.

### Estados

- `available`: CTA ativo e linguagem orientada a acao;
- `building`: CTA desabilitado e selo "Em construcao";
- `planned`: selo "Em breve", sem promessa de data;
- `assisted`: ferramenta disponivel com servico profissional relacionado;
- erro de rota ou manifesto: card nao deve ser exibido como disponivel.

## Metadados compartilhados

O `ToolManifest` deve continuar responsavel pelos dados tecnicos e receber uma
camada de apresentacao tipada, sem inserir JSX ou HTML nos manifestos.

Metadados propostos:

- `resultLabel`: resultado principal, como `PDF` ou `PNG`;
- `estimatedTime`: texto curto, como `5 a 10 min`;
- `benefits`: lista de duas ou tres frases curtas;
- `privacyLabel`: explicacao curta do processamento;
- `primaryActionLabel`: CTA especifico da ferramenta;
- `professionalService`: referencia opcional ao servico profissional;
- `featured`: destaque editorial opcional;
- `popularityLabel`: selo editorial opcional.

Os dados comerciais devem ficar em um catalogo separado e tipado. Esse catalogo
sera a fonte unica para:

- nome publico do servico;
- preco ou faixa de preco;
- unidade de cobranca;
- texto de apoio;
- destino de contato;
- relacao entre servico e ferramenta.

O catalogo publico nao deve importar automaticamente todos os valores do
documento interno. Cada item precisa de autorizacao editorial explicita para ser
exibido.

## Componentes compartilhados

### `ToolCard`

Responsavel pela anatomia, estados, responsividade, CTAs e acessibilidade dos
cards. Deve ser reutilizado no catalogo React e servir de referencia estrutural
para a vitrine institucional.

### `ToolBenefits`

Lista semantica curta, com limite de itens por contexto. Nao aceita HTML livre.

### `ProfessionalServiceLink`

Renderiza a ponte comercial opcional. Deve informar que se trata de atendimento
ou servico adicional e nunca substituir o CTA da ferramenta.

### `ToolPageHeader`

Substitui a repeticao atual das paginas em `App.tsx`. Exibe voltar, estado,
titulo, descricao e indicadores de privacidade de maneira consistente.

### `ToolWorkspaceShell`

Area clara que envolve cada ferramenta dentro do fundo institucional escuro.
Define largura, espacos, contraste e comportamento mobile, sem sobrescrever os
namespaces CSS internos das ferramentas.

## Paginas internas

As ferramentas existentes possuem diferentes densidades, larguras e padroes de
cabecalho. A padronizacao deve ocorrer na camada externa, preservando a logica e
os estilos isolados de cada ferramenta.

Todas as paginas internas terao:

- navegacao institucional consistente;
- link de retorno proximo ao titulo;
- cabecalho compacto em celulares;
- status da ferramenta;
- descricao curta;
- indicador de processamento e privacidade;
- area de trabalho clara e responsiva;
- CTA de atendimento apenas apos o usuario entender ou concluir a tarefa.

O bloco comercial interno, quando aplicavel, deve aparecer no final do fluxo ou
apos o resultado. Ele nao deve disputar atencao com formularios incompletos.

## Busca e filtros

A vitrine deve evoluir de categorias estaticas para controles funcionais:

- busca por nome, descricao, resultado e beneficio;
- filtros por categoria;
- filtro opcional "Disponiveis agora";
- contador de resultados;
- mensagem de estado vazio com acao para limpar filtros.

No celular, as categorias devem usar rolagem horizontal acessivel ou um controle
compacto. O filtro ativo precisa ser perceptivel por cor, texto e estado ARIA.

## Acessibilidade

- estrutura semantica com `article`, listas e headings ordenados;
- foco visivel em links, botoes, filtros e cards acionaveis;
- contraste WCAG AA;
- selos nao podem ser a unica forma de comunicar estado;
- `aria-disabled` ou `disabled` coerente em itens indisponiveis;
- resultados de busca anunciados com `aria-live="polite"`;
- respeito a `prefers-reduced-motion`;
- navegacao completa por teclado;
- alvos de toque de no minimo 44 px.

## Desempenho

- nenhum framework visual novo;
- icones SVG locais;
- sem imagens decorativas pesadas dentro dos cards;
- animacoes limitadas a opacidade e transform;
- evitar duplicacao manual de catalogos entre HTML e React no estado final;
- manter o carregamento das ferramentas independente dos metadados comerciais.

## Estrategia de integracao com o trabalho do Claude

O Claude pode continuar criando as novas ferramentas em
`servicos/hub/src/features/tools/*`, com CSS isolado e status `building`.

A padronizacao Codex atuara principalmente em:

- contratos compartilhados;
- catalogo comercial;
- componentes de apresentacao;
- vitrine institucional;
- roteamento e cabecalhos;
- testes de integracao e responsividade.

As ferramentas novas so serao marcadas como `available` apos implementacao,
integracao e validacao individual. O plano de UI/UX nao antecipara essa
liberacao.

## Fases de entrega

### Fase 1 - Fundacao

- tokens e contratos compartilhados;
- catalogo comercial tipado;
- `ToolCard` e componentes auxiliares;
- testes unitarios dos estados e CTAs.

### Fase 2 - Vitrine

- aplicar o padrao B aos cards;
- aplicar a extensao C aos cards assistidos;
- ativar busca e categorias;
- validar desktop, tablet e celular.

### Fase 3 - Paginas internas

- criar `ToolPageHeader` e `ToolWorkspaceShell`;
- reduzir repeticao em `App.tsx`;
- padronizar privacidade, status e retorno;
- adicionar bloco comercial contextual.

### Fase 4 - Qualidade

- auditoria de teclado, foco, contraste e movimento;
- testes em larguras de 320, 375, 768 e 1440 px;
- testes de integracao de rotas e cards;
- lint, suite completa e build;
- atualizacao do ROADMAP.

## Criterios de aceite

- todos os cards disponiveis possuem CTA principal claro;
- cards assistidos possuem CTA profissional secundario;
- nenhum preco aparece sem contexto de cobranca;
- nenhum card quebra ou exige rolagem horizontal em 320 px;
- filtros funcionam por teclado e leitor de tela;
- paginas internas compartilham cabecalho e area de trabalho;
- ferramentas continuam funcionando sem alteracao de dominio;
- novas ferramentas `building` permanecem indisponiveis;
- testes, lint e build passam;
- acentuacao PT-BR permanece integra.

## Fora do escopo

- alterar regras de negocio das ferramentas;
- publicar ferramentas ainda nao validadas;
- criar checkout ou pagamento online;
- armazenar dados de clientes;
- alterar precos comerciais;
- substituir o canal de atendimento existente;
- redesenhar paginas institucionais fora da area de servicos digitais.
