# Padrão das landing pages dos sistemas Plena

Versão 1.0 · 11/11/2026 · Referência: Gestão Terapia aprovado pelo responsável.

## 1. Finalidade e autoridade

Este documento orienta os agentes na evolução das demais landing pages de sistemas, usando a aplicação final do Gestão Terapia como referência visual e funcional. O objetivo é apresentar cada sistema dentro do ambiente de trabalho do seu cliente, com leitura clara, imagens valorizadas e demonstração coerente com o que a página anuncia.

Leia antes a base obrigatória em [`.Agent/README.md`](../.Agent/README.md) e seus documentos relacionados. Este guia não altera a governança e não autoriza, por si só, modificar todas as páginas, preços, sistemas ou arquivos compartilhados. Execute o segmento atribuído pelo responsável e preserve alterações existentes no workspace.

**Referência consolidada:** commits `fdaaac6` (evolução da landing e demonstração) e `9fff885` (logo). O código atual e novas instruções do responsável prevalecem. O [plano inicial do Terapia](../docs/estrategia/PLANO-VISUAL-GESTAO-TERAPIA-2026-11-11.md) contém propostas históricas substituídas durante a lapidação; não reproduzir a direção inicial navy/azul ou etapas intermediárias como se fossem o resultado final.

## 2. Arquivos de referência

| Arquivo | O que consultar |
| --- | --- |
| [`gestao-terapia.html`](gestao-terapia.html) | Ordem das seções, marca, CTAs, planos, FAQ, modal e metadados |
| [`assets/gestao-terapia.css`](assets/gestao-terapia.css) | Identidade, hero, perspectiva, superfícies sólidas, alinhamento e breakpoints |
| [`assets/gestao-terapia.js`](assets/gestao-terapia.js) | Foco, overlays, Escape, retorno ao acionador e comparação no celular |
| [`assets/produtos.js`](assets/produtos.js) | Carregador compartilhado da demo e parâmetros de entrada |
| [`../assets/images/terapia/`](../assets/images/terapia/) | Fotografia de ambiente e capturas reais com dados fictícios |
| [`assets/logo.png`](assets/logo.png) | Logo específica do Terapia, fornecida pelo responsável |
| [`../tecnologia/demos/gestao-terapia/assets/js/demo-entry.js`](../tecnologia/demos/gestao-terapia/assets/js/demo-entry.js) | Entrada controlada nas telas exibidas na landing |
| [`../tests/therapy-demo-entry.test.js`](../tests/therapy-demo-entry.test.js) | Contrato da abertura contextual e compatibilidade da abertura padrão |
| [`../tests/therapy-demo-appearance.test.js`](../tests/therapy-demo-appearance.test.js) | Tema inicial e personalização da demo |

## 3. O que padronizar e o que adaptar

| Padronizar entre as páginas | Adaptar ao sistema e ao público |
| --- | --- |
| Hierarquia, respiros e qualidade de leitura | Fotografia do ambiente profissional |
| Hero com fotografia completa e transparência no lado do texto | Logo, nome, paleta e linguagem do segmento |
| Módulos com telas reais em perspectiva | Recursos e telas efetivamente existentes |
| Seções distintas, contorno discreto e cantos suaves | Quantidade de módulos conforme o produto |
| Fundo sólido apenas atrás dos textos dos módulos | Cores das superfícies e acentos |
| Alinhamento desktop com as extremidades úteis da navbar | Destinos e parâmetros suportados pela demo |
| CTA contextual que abre a tela correspondente | Planos, preços, modalidades e condições aprovadas |
| Responsividade, foco visível e navegação acessível | Mensagens do WhatsApp e conteúdo do FAQ |

O consultório, o prontuário e a cor esmeralda pertencem ao contexto do Terapia. Outros segmentos devem transmitir seu próprio cenário. Não transportar textos clínicos, fotografia de consultório, pacientes ou promessas do Terapia para sistemas de outros setores.

## 4. Estrutura recomendada da página

1. **Navbar fixa:** logo e nome do sistema à esquerda; navegação curta, demonstração e WhatsApp à direita. Menu próprio para celular.
2. **Hero de ambiente:** título com benefício concreto, descrição curta, CTA de demonstração e CTA de planos. Fotografia relacionada ao local de trabalho do cliente.
3. **Introdução à rotina:** explicar a ligação entre as necessidades do público e os módulos reais; incluir âncoras para os módulos.
4. **Módulos do sistema:** blocos alternados com tela ao fundo, texto legível e ação contextual. O Terapia utiliza agenda, acompanhamento e financeiro.
5. **Confiança e condições de uso:** explicar armazenamento, modalidades e responsabilidades conforme o produto real. Não copiar alegações técnicas sem conferência.
6. **Planos:** apresentação comparável de modalidade, público, preço, periodicidade, recursos e ação.
7. **FAQ:** respostas específicas que resolvam dúvidas de compra e uso.
8. **Fechamento e rodapé:** ação clara, identificação institucional e links existentes.

Não criar blocos repetitivos apenas para alongar a página. Cada seção deve acrescentar uma informação útil para a decisão do cliente.

## 5. Identidade e tipografia de referência

No Terapia, a base é marfim `#f8f6ef`, com superfície alternada sálvia `#e9ede3`, títulos verde profundo `#203d34` e acento `#326956`. Textos corridos usam verde acinzentado com contraste suficiente. A demonstração utiliza fundo claro e verde esmeralda nativo `#047857`; a diferença entre acento da landing e acento da interface é intencional.

| Elemento | Referência do Terapia |
| --- | --- |
| Família dos títulos | DM Serif Display, peso 400 |
| Família do corpo e controles | Inter |
| Título da hero | `clamp(44px, 4.5vw, 66px)`; ajustes por breakpoint |
| Títulos dos módulos | `clamp(38px, 3.4vw, 50px)` no desktop; 36px até 600px |
| Descrição dos módulos | 18px, entrelinha 1,75; 16px até 600px |
| Listas e CTA dos módulos | 16px; 15px até 600px |
| Observação secundária dos módulos | 14px |

Estes valores são referências verificadas no piloto, não justificam cortes ou quebras ruins em outro produto. Ajustar ao conteúdo real sem reduzir arbitrariamente a legibilidade para caber.

## 6. Hero: fotografia inteira e texto destacado

- Manter a imagem inteira, proporcional, sem esticar ou recortar os elementos importantes do ambiente.
- No desktop, usar a fotografia como camada de fundo da abertura. No piloto, a imagem ocupa 100% da largura, com altura automática e centralização vertical.
- Aplicar gradiente da cor base: mais opaco no lado do texto e progressivamente transparente no lado da fotografia. Suavizar as extremidades superior e inferior quando necessário.
- A imagem deve continuar reconhecível. Não escurecer toda a abertura para compensar texto mal posicionado.
- No celular, empilhar texto e fotografia. Preservar a proporção da imagem; não forçar a composição lateral do desktop.
- Reservar espaço para o cabeçalho fixo e configurar `scroll-margin-top` das âncoras. No piloto, a referência é 104px.

## 7. Módulos: composição final aprovada

### Camadas e organização

Cada módulo deve ter contorno sutil, recorte próprio e separação do próximo bloco. Referências: intervalo de 32px no desktop e 20px no celular; raio de 18px no desktop e 12px no celular. Alternar superfícies com discrição.

A estrutura do piloto é:

```text
article.therapy-feature [ou variante --reverse]
├── figure.therapy-screen → img da tela real
└── div.container.therapy-feature__grid
    └── div.therapy-feature__copy
        ├── capítulo e título
        ├── descrição e lista de recursos
        └── botão de demonstração contextual
```

Adaptar os nomes de classe para o novo produto. A figura é irmã da grade, não descendente dela. Isso mantém a ordem das camadas: imagem (z-index 0), gradiente da seção (1), grade e conteúdo (2). O fundo sólido do texto usa `::before`, dentro de um bloco com `position: relative` e `isolation: isolate`.

### Tela como fundo em perspectiva

- A captura pertence ao fundo visual do módulo, sem moldura de navegador, legendas flutuantes ou cartões ornamentais ao redor.
- No desktop, a tela ocupa cerca de 76% da largura, com altura proporcional e centralização vertical.
- Referência: `perspective(1600px) rotateY(9deg) rotateZ(-.5deg)`. Na composição invertida, espelhar os sinais de rotação e a posição lateral.
- O lado oposto ao texto deve parecer mais próximo do visitante; manter a inclinação discreta e consistente entre os módulos.
- Máscaras verticais suavizam as extremidades da imagem. A seção deve recortar o conteúdo transformado com `overflow: hidden`.
- Não distorcer a captura ou reconstruir uma interface fictícia para substituir a tela real.

### Fundo dos textos e alinhamento

**O estado final aprovado utiliza fundo totalmente opaco apenas atrás do bloco de escrita.** A superfície acompanha a cor da seção, com cantos suaves. Não aplicar vidro, transparência ou desfoque ao painel: o vidro foi experimentado e posteriormente removido. O gradiente de integração da imagem continua sendo uma camada separada da seção.

No desktop acima de 900px:

- Navbar com largura máxima de 1248px e padding horizontal de 24px: área útil máxima de 1200px.
- Grade dos módulos com largura máxima de 1200px e sem padding horizontal; grupo externo dos módulos com recuo de 24px.
- Texto em bloco com largura aproximada de 48% e máximo de 560px; sem padding interno que desloque a borda de alinhamento.
- Painel sólido pode se estender 24px além do conteúdo (`inset: -24px` no pseudoelemento), mantendo os textos alinhados à navbar.
- Blocos do lado esquerdo: texto à esquerda, alinhado ao início da marca na navbar.
- Blocos do lado direito: **títulos, descrições, listas, capítulo e CTA alinhados à direita**, usando a extremidade do botão “Falar pelo WhatsApp” como referência. Os marcadores da lista acompanham o lado direito.

Não confundir alinhar o contêiner com alinhar seu conteúdo: ambos precisam seguir a referência do lado correspondente.

### Tablet e celular

- Até 900px, colocar o texto na parte superior e a tela na parte inferior. A escrita volta ao alinhamento de leitura à esquerda.
- Reservar espaço inferior para a imagem, sem usar altura fixa que corte textos maiores. Referências do piloto: padding inferior de 360px no tablet e 235px até 600px.
- No tablet, captura com aproximadamente 94% da largura; no celular, até 100%, sempre contida pelo módulo.
- Reduzir a perspectiva: referência de 1200px no tablet e 800px no celular, com `rotateY(7deg)` e leve `rotateX`.
- Ajustar as alturas mínimas ao conteúdo. No piloto, 700px no desktop, 660px até 1100px, 800px até 900px e 680px até 600px; o conteúdo pode ampliar a seção.
- Conferir especialmente títulos longos, descrições, marcadores e CTAs em 320px. Não ocultar o problema com corte de texto.

## 8. Capturas e demonstração: correspondência obrigatória

1. Abrir a demonstração real do segmento e identificar as telas que comprovam os benefícios apresentados.
2. Usar exclusivamente dados fictícios, com identificação de demonstração na experiência. Capturar a interface carregada, sem loaders ou diálogos acidentais.
3. Configurar uma aparência coerente entre captura e demo. No Terapia: modo claro, fundo branco e acentos esmeralda. Para outro sistema, utilizar as opções nativas compatíveis com sua identidade.
4. Salvar capturas proporcionais e com resolução suficiente; o piloto utiliza 1440 × 960. Informar `width`, `height`, descrição `alt` e carregamento tardio nas imagens abaixo da primeira dobra.
5. Conectar o botão de cada módulo à tela correspondente, inclusive ao registro fictício relevante quando a captura mostrar uma ficha específica.
6. Conferir no navegador que a tela abriu de fato. Transmitir um parâmetro na URL sem implementar sua leitura na demo não conclui a tarefa.

Contrato do carregador já existente:

```javascript
// Exemplos reais do Terapia; não presumir estas rotas em outros sistemas.
openDemoModal({ view: 'schedule' });
openDemoModal({ view: 'patients' });
openDemoModal({ view: 'financial' });
openDemoModal(); // A abertura genérica continua funcionando.
```

No Terapia, `demo-entry.js` aceita somente os três destinos conhecidos. O fluxo de pacientes abre `demo_patient_13`, que corresponde à captura. Isso é específico da base fictícia do Terapia: não copiar esse ID para outra demo.

Antes de alterar a demo de outro sistema, verificar seu roteador, inicialização e eventual service worker. Atualizar versões de assets/cache quando aplicável. Manter a experiência real de personalização: o padrão inicial não deve inutilizar os controles de tema e cores. Não alterar o sistema de produção para montar uma vitrine.

## 9. Marca e imagens

- Usar a logo fornecida ou aprovada para aquele produto. Manter proporções e dimensões reservadas no HTML.
- No Terapia, `produtos/assets/logo.png` é a logo específica, exibida em 64px no desktop e 44px até 600px, junto ao nome e à assinatura “Uma solução Plena”. Apesar do nome genérico do arquivo, ela não é uma logo compartilhada dos sistemas.
- O fundo branco dessa imagem foi integrado à navbar por `mix-blend-mode: multiply`. **O PNG não recebeu canal alpha por essa alteração.** Não descrever essa solução como arquivo transparente.
- A mesclagem é adequada ao fundo claro atual; reavaliar em superfícies escuras ou coloridas. Não redesenhar a marca ou alterar a imagem original para resolver um detalhe de aplicação.
- Guardar as imagens de cada novo segmento em diretório próprio e usar nomes explícitos, evitando substituir `logo.png` do Terapia.
- Preservar o arquivo original fornecido. Não usar fotografias, capturas ou dados privados de clientes na vitrine.

## 10. Planos, conteúdo e acessibilidade

- Preservar valores e condições aprovadas do produto. Não copiar os preços do Terapia, criar novos planos ou inventar selos como “Mais escolhido”.
- Separar compra única de recorrência; deixar claras diferenças entre uso local, agendamento online e hospedagem, quando existirem.
- Conferir benefícios contra o sistema. Não apresentar garantia absoluta de segurança, conformidade ou resultado profissional.
- Atualizar title, description, canonical, Open Graph, JSON-LD, rótulos e mensagens de contato para o segmento correto. Não deixar metadados do Terapia na nova página.
- Usar títulos em ordem lógica, texto alternativo útil e controles semânticos. Manter CTA operável por teclado e foco visível.
- No modal e menu, conferir Escape, entrada e retorno de foco e bloqueio do fundo. Usar o script do piloto como referência, adaptando seus seletores e dependências; não carregá-lo em páginas com DOM incompatível.
- Respeitar preferência por movimento reduzido. A perspectiva pode ser estática; não exige animações de entrada ou movimento contínuo.

## 11. Implementação e limites de colaboração

1. Ler a base `.Agent`, este guia e o código atual do segmento. Conferir `git status --short` antes de editar.
2. Declarar pacote e arquivos; registrar a ação. Inventariar logo, fotografia, telas, rotas, planos e particularidades do produto.
3. Manter estilos sob classe exclusiva de página e em stylesheet próprio, carregado depois de `produtos.css`. Criar script específico somente quando necessário.
4. Não editar o Terapia para experimentar a próxima landing. Não extrair tudo para CSS global durante uma adaptação isolada.
5. Preservar o contrato do carregador compartilhado. Qualquer alteração compartilhada precisa de coordenação e verificação de regressão nas páginas consumidoras.
6. Adaptar ambiente, módulos e demo; executar as validações abaixo e registrar evidências.
7. Entregar a prévia local ao responsável. Commit, push e publicação dependem da autorização aplicável à tarefa; este documento não fornece autorização geral para essas ações.

## 12. Critérios de aceite e entrega aos próximos agentes

- [ ] Hero mostra o ambiente completo com leitura confortável e cabeçalho sem cobrir conteúdo.
- [ ] Logo correta, sem distorção e com boa integração ao fundo.
- [ ] Seções distintas, com respiro, contorno discreto e perspectiva consistente.
- [ ] Escritas dos módulos com fundo sólido; sem retorno involuntário ao vidro.
- [ ] No desktop, extremidades dos textos alinhadas à marca e ao WhatsApp da navbar; conteúdo dos blocos direitos alinhado à direita.
- [ ] Capturas e demo usam aparência coerente e somente dados fictícios.
- [ ] Cada CTA contextual abre a tela exata; CTA genérico continua abrindo a demo normalmente.
- [ ] Validação visual em desktop amplo, 768px, 375px e 320px, sem rolagem horizontal, cortes ou sobreposições.
- [ ] Menu, modal, FAQ, âncoras, teclado, foco e Escape conferidos; mensagens do WhatsApp verificadas sem envio não solicitado.
- [ ] Links locais, imagens, acentos UTF-8 e metadados conferidos.
- [ ] `git diff --check` aprovado, CSS analisado e scripts alterados com sintaxe válida.
- [ ] Testes relevantes executados para alterações funcionais. A landing estática não exige build do Hub; se o Hub for alterado, suas verificações obrigatórias passam a ser aplicáveis.
- [ ] Registro datado com arquivos, comandos, resultados reais, capturas, limitações e URL da prévia local.

Os testes `therapy-demo-entry.test.js` e `therapy-demo-appearance.test.js` verificam o contrato do piloto. Quando houver alteração no carregador compartilhado, executá-los como proteção de regressão. Eles não substituem testes e validação visual da demo de outro sistema.

Na entrega, informar o que mudou, o que foi verificado e o que ainda depende de decisão. Não declarar aprovação do responsável, publicação ou suporte a uma largura sem evidência correspondente.
