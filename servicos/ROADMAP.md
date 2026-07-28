# Roadmap do Hub de Soluções Digitais

Atualizado em: 11 de junho de 2026.

## Objetivo

Concluir o Hub de Soluções Digitais da Plena com ferramentas realmente
funcionais, seguras, responsivas e integradas aos serviços presenciais descritos
em `TABELA-DE-PRECOS-E-FERRAMENTAS.md`.

Este documento é a fonte de verdade para:

- estado atual das ferramentas;
- lacunas funcionais conhecidas;
- divisão do trabalho entre agentes;
- critérios técnicos e comerciais de liberação;
- sequência de integração na página pública.

## Legenda de status

| Status | Significado |
| --- | --- |
| `Disponível` | Lógica concluída, testes aprovados e card público liberado |
| `Validação` | Implementação concluída, aguardando teste local do responsável |
| `Em desenvolvimento` | Agente trabalhando no pacote funcional |
| `Base pronta` | Interface e testes básicos existem, mas falta lógica essencial |
| `Planejada` | Escopo definido, implementação ainda não iniciada |
| `Bloqueada` | Depende de decisão, fonte oficial ou correção externa |

## Princípios obrigatórios

1. Processar localmente tudo o que não precisa sair do dispositivo.
2. Não coletar CPF, CNPJ, senhas, tokens ou credenciais governamentais.
3. Não enviar documentos ao Supabase nas ferramentas públicas.
4. Não realizar cálculo tributário, estimativa de multa ou promessa de resultado.
5. Informar claramente quando o resultado é orientativo.
6. Preservar a ferramenta gratuita como ação principal.
7. Apresentar o atendimento profissional apenas como extensão opcional.
8. Liberar uma ferramenta por vez, após teste automatizado e validação local.
9. Manter suporte a teclado, leitores de tela e redução de movimento.
10. Validar cada ferramenta em desktop e nos celulares de 375 px e 320 px.

## Estado geral atual

### Fundação e experiência compartilhada

Status: `Disponível`.

- React, TypeScript, Vite e Vitest configurados em `servicos/hub/`.
- Registro central de ferramentas em `src/app/tool-registry.ts`.
- Metadados comerciais e de apresentação em `src/app/tool-presentation.ts`.
- Layout compartilhado de páginas em `src/app/ToolPageLayout.tsx`.
- Cards React compartilhados em `src/app/ToolCard.tsx`.
- Vitrine institucional com busca, filtros e estados acessíveis.
- Rotas das 11 ferramentas registradas em `src/App.tsx`.
- Ferramentas não concluídas mantidas com status `building`.
- Painel administrativo isolado das ferramentas públicas.

### Inventário das ferramentas

| Ferramenta | Slug | Estado atual | Entrega que falta |
| --- | --- | --- | --- |
| Gerador de QR Code | `qr-code` | `Disponível` | Nenhuma |
| Imagens para PDF | `images-to-pdf` | `Disponível` | Nenhuma |
| Unificador de PDFs | `merge-pdf` | `Disponível` | Nenhuma |
| Criador de Currículo | `resume-builder` | `Disponível` | Nenhuma |
| Gerador de Declarações | `declaration-builder` | `Disponível parcial` | Adicionar orçamento estruturado |
| Checklist MEI e IRPF | `mei-irpf-checklist` | `Disponível parcial` | Download direto do checklist em PDF |
| Gerador de Cardápio | `menu-builder` | `Base pronta` | Renderização e download real do PDF |
| Gerador de Cartão de Visitas | `business-card-creator` | `Base pronta` | Geração e download em PDF e PNG |
| Gerador de Etiquetas | `label-generator` | `Base pronta` | Geração multipágina do PDF |
| Guia DAS MEI | `mei-das-guide` | `Base pronta` | Conteúdo oficial vigente e remoção de cálculo indevido |
| Calculadora de Impressão | `print-cost-estimator` | `Base pronta` | Aplicar preços e comparação real por tipo de página |

## Baseline de qualidade

Antes de qualquer novo pacote:

- a última validação registrada tinha 265 testes aprovados;
- lint estava limpo;
- build de produção estava aprovado;
- os cinco novos cards estavam bloqueados como `Em construção`.

Cada agente deve executar novamente os comandos e reportar os números atuais. O
baseline não substitui uma nova validação.

```powershell
cd servicos\hub
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

## Estratégia de execução paralela

Os pacotes F1 a F7 são independentes e podem ser executados em paralelo, desde
que cada agente respeite a propriedade de arquivos.

### Arquivos reservados ao integrador

Durante o desenvolvimento paralelo, nenhum agente funcional deve alterar:

- `servicos/hub/src/App.tsx`;
- `servicos/hub/src/app/tool-registry.ts`;
- `servicos/hub/src/app/tool-presentation.ts`;
- `servicos/servicos.html`;
- `servicos/style.css`;
- `servicos/ROADMAP.md`;
- `servicos/hub/package.json`;
- `servicos/hub/package-lock.json`.

Esses arquivos serão alterados somente no pacote I1, depois que as entregas
funcionais forem validadas.

### Regras para cada agente

1. Trabalhar apenas na pasta da ferramenta atribuída.
2. Usar TDD: teste falhando, implementação mínima e teste aprovado.
3. Não marcar o manifesto como `available`.
4. Não liberar card ou botão na página institucional.
5. Não instalar dependências sem autorização do integrador.
6. Não alterar preços, textos comerciais ou avisos fora do escopo.
7. Não substituir processamento local por API ou serviço externo.
8. Informar no encerramento qualquer alteração necessária fora do prompt.

## Pacote F1 — Cartão de visitas

Status: `Planejada`.

Pasta proprietária:

`servicos/hub/src/features/tools/business-card-creator/`

### Situação atual

- formulário de dados implementado;
- três estilos visuais implementados;
- prévia responsiva implementada;
- impressão pelo navegador implementada;
- `generatePdf` padrão retorna um `Uint8Array` vazio;
- não existe download em PDF;
- não existe geração em PNG.

### Entrega funcional

- Criar módulo de domínio para composição do cartão.
- Gerar PDF no tamanho real de cartão de visitas, 90 × 50 mm.
- Gerar PNG em alta resolução, no mínimo 1063 × 591 px.
- Preservar os estilos `classic`, `modern` e `colorful`.
- Omitir campos opcionais vazios sem deixar espaços quebrados.
- Usar nome completo como único campo obrigatório.
- Baixar arquivos com nomes previsíveis:
  `plena-cartao-visitas.pdf` e `plena-cartao-visitas.png`.
- Revogar URLs temporárias após o download.
- Manter todos os dados somente em memória.

### Arquivos previstos

- Criar `domain/create-business-card-pdf.ts`.
- Criar `domain/create-business-card-pdf.test.ts`.
- Criar `domain/create-business-card-png.ts`.
- Criar `domain/create-business-card-png.test.ts`.
- Modificar `ui/BusinessCardCreatorTool.tsx`.
- Modificar `ui/BusinessCardCreatorTool.test.tsx`.
- Ajustar `ui/business-card-creator.css` somente se necessário.

### Critérios de aceite

- PDF abre com exatamente uma página.
- PDF usa dimensões de 90 × 50 mm.
- PNG possui resolução de impressão adequada.
- Os três estilos produzem resultados visualmente distintos.
- Botões permanecem desabilitados sem nome.
- Falha de geração apresenta mensagem acessível com `role="alert"`.
- PDF e PNG são produzidos sem rede e sem upload.
- Testes focados, suite completa, lint e build aprovados.

## Pacote F2 — Gerador de cardápio

Status: `Planejada`.

Pasta proprietária:

`servicos/hub/src/features/tools/menu-builder/`

### Situação atual

- cadastro e remoção de categorias implementados;
- cadastro e remoção de itens implementados;
- formatos A4 e meio sulfite disponíveis na interface;
- seleção de uma ou duas colunas implementada;
- `generatePdf` padrão retorna um `Uint8Array` vazio;
- não existe prévia final nem download real.

### Entrega funcional

- Criar um modelo de documento normalizado e independente da UI.
- Validar nome do estabelecimento, categoria e nome de cada item.
- Ignorar categorias vazias somente quando não possuírem itens preenchidos.
- Gerar PDF A4 ou A5, conforme a opção `half`.
- Suportar uma ou duas colunas.
- Criar páginas adicionais automaticamente quando o conteúdo exceder a página.
- Evitar corte de título, categoria, item ou preço entre páginas.
- Exibir estabelecimento e número da página em todas as páginas adicionais.
- Baixar como `plena-cardapio.pdf`.
- Revogar a URL temporária após o download.

### Arquivos previstos

- Criar `domain/menu-data.ts`.
- Criar `domain/menu-data.test.ts`.
- Criar `domain/create-menu-pdf.ts`.
- Criar `domain/create-menu-pdf.test.ts`.
- Modificar `ui/MenuBuilderTool.tsx`.
- Modificar `ui/MenuBuilderTool.test.tsx`.
- Ajustar `ui/menu-builder.css` somente se necessário.

### Critérios de aceite

- Um cardápio simples gera PDF de uma página.
- Conteúdo extenso gera múltiplas páginas sem sobreposição.
- Preços opcionais não geram pontuação ou espaço residual.
- A4, A5, uma coluna e duas colunas são testados.
- O botão só é liberado com estabelecimento e ao menos um item válido.
- O PDF é produzido localmente.
- Testes focados, suite completa, lint e build aprovados.

## Pacote F3 — Gerador de etiquetas

Status: `Planejada`.

Pasta proprietária:

`servicos/hub/src/features/tools/label-generator/`

### Situação atual

- entrada de uma etiqueta por linha implementada;
- layouts 2 × 6, 3 × 9 e 4 × 13 implementados na prévia;
- contagem e aviso de páginas adicionais implementados;
- opção de borda existe apenas na interface;
- `generatePdf` padrão retorna um `Uint8Array` vazio;
- não existe PDF real.

### Entrega funcional

- Criar catálogo único de dimensões, margens, linhas e colunas.
- Usar o mesmo catálogo na prévia e no PDF.
- Incluir `withBorder` no contrato de geração.
- Gerar páginas adicionais quando a capacidade for excedida.
- Manter a ordem exata das linhas informadas.
- Centralizar e quebrar textos longos dentro da etiqueta.
- Impedir que o texto ultrapasse os limites físicos.
- Baixar como `plena-etiquetas.pdf`.
- Revogar a URL temporária após o download.

### Arquivos previstos

- Criar `domain/label-layouts.ts`.
- Criar `domain/label-layouts.test.ts`.
- Criar `domain/create-labels-pdf.ts`.
- Criar `domain/create-labels-pdf.test.ts`.
- Modificar `ui/LabelGeneratorTool.tsx`.
- Modificar `ui/LabelGeneratorTool.test.tsx`.
- Ajustar `ui/label-generator.css` somente se necessário.

### Critérios de aceite

- Cada layout respeita sua capacidade física.
- Quantidades superiores à capacidade criam páginas adicionais.
- Bordas aparecem somente quando solicitadas.
- Linhas vazias são ignoradas.
- Textos longos não invadem etiquetas vizinhas.
- O PDF é produzido localmente.
- Testes focados, suite completa, lint e build aprovados.

## Pacote F4 — Calculadora de impressão

Status: `Planejada`.

Pasta proprietária:

`servicos/hub/src/features/tools/print-cost-estimator/`

### Situação atual

- cálculo estimado da impressora própria implementado na UI;
- custo Plena está fixado em zero;
- páginas pretas e coloridas são somadas antes da comparação;
- não existe módulo de domínio testável;
- a ferramenta produz um comparativo incorreto.

### Regras comerciais do documento-base

- impressão preta: R$ 3,00 por página;
- impressão colorida: R$ 4,00 por página;
- o comparativo é orientativo e não constitui proposta comercial;
- não devem ser exibidos preços de concorrentes.

### Entrega funcional

- Extrair parsing e cálculos para um módulo de domínio puro.
- Calcular separadamente páginas pretas e coloridas.
- Calcular o custo Plena com os valores do documento-base.
- Calcular custo próprio por página com toner, papel e manutenção.
- Distribuir manutenção pelo volume mensal somente para exibição por página.
- Exibir economia ou custo adicional, sem usar apenas valor absoluto.
- Exibir cenário empatado quando a diferença for inferior a R$ 0,01.
- Tratar campos vazios, negativos e divisores iguais a zero.
- Manter impressão do comparativo pelo navegador.
- Informar que acabamento, encadernação, papel especial e entrega não estão
  incluídos.

### Arquivos previstos

- Criar `domain/print-cost.ts`.
- Criar `domain/print-cost.test.ts`.
- Modificar `ui/PrintCostEstimatorTool.tsx`.
- Modificar `ui/PrintCostEstimatorTool.test.tsx`.
- Ajustar `ui/print-cost-estimator.css` somente se necessário.

### Critérios de aceite

- Páginas pretas usam R$ 3,00 e coloridas usam R$ 4,00.
- Resultado distingue economia, custo adicional e empate.
- Divisão por zero nunca produz `NaN` ou `Infinity`.
- Valores negativos são rejeitados ou normalizados com mensagem clara.
- O comparativo continua marcado como orientativo.
- Testes focados, suite completa, lint e build aprovados.

## Pacote F5 — Guia DAS MEI

Status: `Planejada`.

Pasta proprietária:

`servicos/hub/src/features/tools/mei-das-guide/`

### Situação atual

- seleção de atividade implementada;
- marcação dos meses pagos implementada;
- impressão da organização implementada;
- valores aparecem como `{valor}`;
- existe linha de CPP proporcional para empregado;
- o documento-base proíbe cálculo proporcional ou tributário.

### Entrega funcional

- Consultar fontes oficiais do Governo Federal no momento da implementação.
- Registrar no código a competência, a data de conferência e os links oficiais.
- Exibir apenas componentes fixos oficiais do DAS aplicáveis ao exercício.
- Não calcular salário, CPP, multa, juros, faturamento ou imposto proporcional.
- Remover o cálculo e a linha `CPP (empregado)`.
- Remover a pergunta sobre empregado se ela não produzir orientação válida.
- Exibir valor total fixo por tipo de atividade somente quando confirmado.
- Transformar o texto do Portal do Empreendedor em link externo real.
- Abrir links oficiais com proteção `rel="noopener noreferrer"`.
- Manter a lista mensal como organizador local sem persistência.
- Exibir aviso de que os valores podem mudar e devem ser confirmados no portal.

### Arquivos previstos

- Criar `domain/das-values.ts`.
- Criar `domain/das-values.test.ts`.
- Modificar `ui/MeiDasGuideTool.tsx`.
- Modificar `ui/MeiDasGuideTool.test.tsx`.
- Ajustar `ui/mei-das-guide.css` somente se necessário.

### Critérios de aceite

- Nenhum placeholder `{valor}` permanece.
- Nenhuma base proporcional de salário ou faturamento é calculada.
- Valores possuem ano de referência e fonte oficial.
- Link do Portal do Empreendedor é navegável e seguro.
- O aviso contábil permanece visível antes e depois da seleção.
- O conteúdo não promete regularidade fiscal nem substitui contador.
- Testes focados, suite completa, lint e build aprovados.

## Pacote F6 — Orçamento no gerador de documentos

Status: `Planejada`.

Pasta proprietária:

`servicos/hub/src/features/tools/declaration-builder/`

### Situação atual

- declarações orientadas e recibo particular estão funcionais;
- prévia A4 e download em PDF estão funcionais;
- o serviço comercial divulgado inclui declaração, orçamento e recibo;
- não existe modelo estruturado de orçamento.

### Entrega funcional

- Adicionar o modelo `quote` ao catálogo de documentos.
- Coletar emitente, cliente, descrição, quantidade, valor unitário e observação.
- Permitir adicionar e remover itens.
- Calcular subtotal e total de forma local.
- Permitir validade do orçamento e condições de pagamento.
- Incluir aviso de que orçamento não é nota fiscal nem contrato.
- Gerar prévia e PDF no mesmo padrão profissional existente.
- Manter o recibo e todos os modelos atuais sem regressão.
- Baixar como `plena-orcamento.pdf` quando esse modelo for selecionado.

### Arquivos previstos

- Modificar `domain/declaration-templates.ts`.
- Modificar `domain/declaration-templates.test.ts`.
- Modificar `domain/declaration-data.ts`.
- Modificar `domain/declaration-data.test.ts`.
- Modificar `domain/build-declaration.ts`.
- Modificar `domain/build-declaration.test.ts`.
- Modificar `domain/create-declaration-pdf.ts`.
- Modificar `domain/create-declaration-pdf.test.ts`.
- Modificar `ui/DeclarationBuilderTool.tsx`.
- Modificar `ui/DeclarationBuilderTool.test.tsx`.

### Critérios de aceite

- Orçamento aceita um ou mais itens.
- Total corresponde à soma de quantidade × valor unitário.
- Campos monetários aceitam formato brasileiro.
- Itens inválidos impedem o download e indicam o problema.
- O PDF inclui validade, condições e aviso editorial.
- Os modelos existentes continuam aprovados.
- Testes focados, suite completa, lint e build aprovados.

## Pacote F7 — PDF do Checklist MEI e IRPF

Status: `Planejada`.

Pasta proprietária:

`servicos/hub/src/features/tools/mei-irpf-checklist/`

### Situação atual

- fluxo MEI e IRPF funcional;
- perguntas condicionais funcionais;
- checklist personalizado e progresso funcionais;
- impressão pelo navegador funcional;
- não existe download direto do PDF.

### Entrega funcional

- Criar serialização estável do checklist final.
- Gerar PDF local com título, cenário e grupos de documentos.
- Representar itens marcados e pendentes de forma legível em preto e branco.
- Incluir os três avisos obrigatórios no PDF.
- Não incluir respostas intermediárias que possam expor dados desnecessários.
- Manter o botão de impressão como alternativa.
- Adicionar botão `Baixar checklist em PDF`.
- Baixar como `plena-checklist-mei.pdf` ou `plena-checklist-irpf.pdf`.
- Revogar a URL temporária após o download.

### Arquivos previstos

- Criar `domain/create-checklist-pdf.ts`.
- Criar `domain/create-checklist-pdf.test.ts`.
- Modificar `ui/MeiIrpfChecklistTool.tsx`.
- Modificar `ui/MeiIrpfChecklistTool.test.tsx`.
- Ajustar `ui/mei-irpf-checklist.css` somente se necessário.

### Critérios de aceite

- PDF reflete exatamente os grupos e itens exibidos na tela.
- MEI e IRPF produzem nomes de arquivos diferentes.
- Marcados e pendentes são distinguíveis sem depender de cor.
- Os avisos obrigatórios aparecem no PDF.
- Nenhum dado sensível é solicitado ou armazenado.
- Testes focados, suite completa, lint e build aprovados.

## Pacote F8 — Propostas comerciais

Status: `Em desenvolvimento`.

Pasta proprietária:

`servicos/hub/src/features/proposals/`

Arquivos compartilhados autorizados neste pacote:

- `servicos/hub/src/App.tsx`;
- `servicos/hub/src/admin/shell/AdminShell.tsx`;
- `servicos/docs/DATA_MODEL.md`;
- `servicos/ROADMAP.md`;
- `servicos/supabase/migrations/`.

### Situação atual

- schema do projeto Supabase `nnckpyzjllqsdcwlnxei` foi aplicado manualmente
  pelo responsável via SQL Editor;
- tabelas `profiles`, `proposals`, `consent_records` e `audit_events` existem
  no schema `public`, com RLS e gatilhos configurados;
- migrações equivalentes precisam ficar versionadas apenas para rastreabilidade;
- não existe interface administrativa de propostas;
- não existe fluxo do cliente para magic link, visualização e aceite.

### Entrega funcional

- Documentar em Git as migrações equivalentes ao schema aplicado manualmente,
  sem executar DDL.
- Adicionar a seção administrativa `/admin/propostas`.
- Permitir criar, listar e enviar propostas, alterando `draft` para `sent`.
- Manter admin com e-mail e senha pelo AuthGuard existente.
- Criar fluxo de cliente fora do AuthGuard administrativo.
- Enviar magic link para o e-mail do cliente.
- Mostrar apenas propostas visíveis ao cliente autenticado por RLS.
- Aceitar proposta via `insert` em `consent_records`.
- Capturar `navigator.userAgent` no aceite; IP permanece nulo no cliente.
- Refletir o status atualizado após o aceite.
- Usar identidade visual da Plena, sem marca do cliente final.
- Não liberar link público na página institucional.

### Arquivos previstos

- Criar `src/features/proposals/domain/proposal-schema.ts`.
- Criar `src/features/proposals/services/proposal-service.ts`.
- Criar `src/features/proposals/ui/AdminProposalsPage.tsx`.
- Criar `src/features/proposals/ui/ClientProposalPage.tsx`.
- Criar `src/features/proposals/ui/proposals.css`.
- Criar testes focados de schema, serviço, admin e cliente.
- Modificar `src/App.tsx`.
- Modificar `src/admin/shell/AdminShell.tsx`.
- Modificar `servicos/docs/DATA_MODEL.md`.
- Modificar `servicos/ROADMAP.md`.
- Criar migrações em `servicos/supabase/migrations/`.

### Critérios de aceite

- Migrações ficam documentadas em Git e não são executadas pela rodada.
- Tipos TypeScript reais do Supabase são gerados quando CLI ou MCP tiver acesso
  ao projeto correto.
- Admin cria proposta em `draft`.
- Admin envia proposta mudando status para `sent` e preenchendo `sent_at`.
- Cliente solicita magic link sem acessar o AuthGuard admin.
- Cliente visualiza somente propostas liberadas para ele pelo banco.
- Cliente aceita proposta apenas inserindo `consent_records`.
- UI não usa dados reais de Jeferson Mathias ou TechTower nos testes.
- Testes focados, suite completa, lint e build aprovados.

## Pacote I1 — Integração e liberação pública

Status: `Bloqueada` até a validação local de cada pacote funcional.

Responsável: Codex ou agente integrador único.

### Pré-condições

- pacote funcional marcado como aprovado pelo responsável;
- relatório do agente recebido;
- nenhuma alteração inesperada fora da pasta proprietária;
- testes focados aprovados;
- suite completa, lint e build aprovados.

### Integração por ferramenta aprovada

1. Injetar a implementação real no componente, removendo defaults vazios.
2. Alterar o manifesto de `building` para `available`.
3. Confirmar o componente no mapa de `src/App.tsx`.
4. Atualizar os testes do registro central.
5. Alterar o card de `Em construção` para `Disponível`.
6. Substituir botão desabilitado por link para a rota da ferramenta.
7. Atualizar textos comerciais somente com base no documento de preços.
8. Executar build de produção.
9. Atualizar os assets publicados em `servicos/ferramentas/qr-code/`.
10. Validar a rota no servidor local sem cache.
11. Validar a vitrine em 1440, 768, 375 e 320 px.
12. Atualizar este ROADMAP com a data de entrega.

### Arquivos centrais previstos

- Modificar `servicos/hub/src/App.tsx` se necessário.
- Modificar `servicos/hub/src/app/tool-registry.ts`.
- Modificar `servicos/hub/src/app/tool-registry.test.ts`.
- Modificar o manifesto da ferramenta aprovada.
- Modificar `servicos/servicos.html`.
- Modificar `servicos/style.css` se necessário.
- Modificar `servicos/ROADMAP.md`.
- Atualizar o build em `servicos/ferramentas/qr-code/`.

## Dívida técnica — Base pública do Hub

O Hub React ainda é publicado em `servicos/ferramentas/qr-code/` por decisão
histórica da primeira ferramenta liberada. Essa base afeta URLs públicas como
`ferramentas/qr-code/#/...` e o `outDir` do Vite.

Não alterar `servicos/hub/vite.config.ts`, a pasta de build ou links públicos
sem decisão arquitetural específica, porque a mudança exige migração de URLs,
validação de SEO, redirects e revisão dos cards já publicados.

## Ordem recomendada de validação local

1. Calculadora de Impressão.
2. Gerador de Etiquetas.
3. Cartão de Visitas.
4. Gerador de Cardápio.
5. Checklist MEI e IRPF em PDF.
6. Orçamento no Gerador de Documentos.
7. Guia DAS MEI.

O Guia DAS fica por último porque exige conferência temporal de fontes oficiais.

## Critério universal para liberar um card

Um card só muda para `Disponível` quando todos os itens abaixo forem atendidos:

- [ ] lógica principal implementada, sem stub ou retorno vazio;
- [ ] nenhum placeholder visível;
- [ ] download ou resultado final testado;
- [ ] testes automatizados focados aprovados;
- [ ] suite completa aprovada;
- [ ] lint aprovado;
- [ ] build aprovado;
- [ ] `git diff --check` sem erro em arquivos-fonte;
- [ ] auditoria de acentuação e mojibake aprovada;
- [ ] funcionamento sem rede confirmado quando aplicável;
- [ ] privacidade revisada;
- [ ] mensagens de erro e limites definidos;
- [ ] teclado e foco visível validados;
- [ ] desktop e mobile validados;
- [ ] responsável realizou teste local e aprovou;
- [ ] ROADMAP atualizado com data e evidências.

## Formato obrigatório do relatório de cada agente

```text
Ferramenta:
Pacote:
Status final:

Arquivos criados:
- caminho

Arquivos modificados:
- caminho

Lógica implementada:
- item

Testes adicionados:
- quantidade e escopo

Validações executadas:
- npm.cmd run test -- <arquivo>
- npm.cmd run test
- npm.cmd run lint
- npm.cmd run build

Resultados:
- testes focados:
- suite completa:
- lint:
- build:

Ajustes fora do escopo:
- nenhum

Pendências ou riscos:
- nenhum
```

Qualquer ajuste fora do escopo deve ser informado explicitamente. O agente não
deve liberar o card por conta própria.

## Etapas futuras, fora deste ciclo

### Conta opcional

- login por magic link ou OTP;
- perfil mínimo;
- sessão e recuperação de acesso;
- exclusão de conta e dados;
- MFA obrigatório para administradores.

As ferramentas locais continuarão disponíveis sem conta.

### Atendimento assistido

- solicitações de atendimento;
- estados operacionais;
- anexos privados apenas quando indispensáveis;
- URLs assinadas curtas;
- trilha de auditoria;
- retenção e descarte automáticos.

### Escala

- métricas sem conteúdo dos documentos;
- limites por usuário e IP em operações remotas;
- planos e cotas somente após validação comercial;
- observabilidade de erros;
- revisões periódicas de segurança e RLS.
