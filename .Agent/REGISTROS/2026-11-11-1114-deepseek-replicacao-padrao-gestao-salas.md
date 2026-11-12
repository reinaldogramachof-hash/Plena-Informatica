# Replicação do padrão de landing page no Gestão Salas

## Identificação e escopo

- Data: 11/11/2026, 11:14. Agente: DeepSeek. Branch: `main`.
- Origem: solicitação do responsável para replicar a estrutura aprovada do Gestão Terapia no Gestão Salas, validando o entendimento do [padrão](../produtos/PADRAO-LANDING-PAGES.md). Imagens dispensadas nesta rodada.
- Referência: `produtos/gestao-terapia.html` no estado dos commits `fdaaac6` e `9fff885`.
- Arquivos criados/alterados: `produtos/gestao-salas.html` (reescrito), `produtos/assets/gestao-salas.css` (novo), `produtos/assets/gestao-salas.js` (novo).
- Preservados: `produtos/assets/produtos.css`, `produtos/assets/produtos.js`, a demo `tecnologia/demos/gestao-salas/` e as demais páginas.

## Como a replicação foi feita

1. **Leitura da referência:** HTML completo, CSS (358 linhas), JS (67 linhas) e o carregador compartilhado.
2. **Folha de estilo derivada:** `gestao-terapia.css` convertida com renomeação de classes (`.therapy-*` → `.salas-*`, 53 classes) e mapa de 46 cores. A paleta de consultório (verde/sálvia) deu lugar à identidade do Salas (marfim + azul-violeta `#4f46c8`), mantendo a mesma estrutura de superfícies, tipografia e breakpoints.
3. **Script derivado:** `gestao-terapia.js` com os seletores adaptados e sem o bloco do quadro comparativo, que o Salas não possui por ter uma única oferta.
4. **Página reescrita** na mesma ordem de blocos: abertura com figura, introdução, três módulos com tela em perspectiva, privacidade, plano, perguntas frequentes, fechamento e rodapé.

## Paridade estrutural verificada

Comparação bloco a bloco dos esqueletos das duas páginas: **20 de 20 blocos na mesma ordem**, com duas diferenças intencionais — o segundo módulo chama-se `#vistoria` (no Terapia é `#acompanhamento`) e o Salas tem **um** card de plano, não três, porque sua oferta aprovada é única.

## Conteúdo adaptado ao segmento

- Textos de módulos, vistoria, sinal e saldo reaproveitados da landing anterior do Salas, sem transporte de conteúdo clínico.
- Plano mantido: **Licença Vitalícia de R$ 299,90**, pagamento único, sem comissão — nenhum plano, preço ou selo foi inventado.
- FAQ com seis perguntas do segmento: vistoria por QR Code, comissão, sinal e saldo, uso offline, guarda dos dados e transferência de base.
- JSON-LD com `Offer` único de 299,90 e `featureList` do produto.
- Rodapé com o CNPJ atualizado `59.779.242/0001-78`.

## O que não foi feito, por decisão de escopo

- **Imagens:** a figura de abertura e as três telas reutilizam `assets/images/herosalas.png`, cada uma marcada com comentário HTML indicando a captura definitiva (1440×960). Nenhum arquivo de imagem foi criado.
- **Demonstração contextual:** os quatro CTAs de módulo usam `openDemoModal()` genérico, porque o demo-entry com `view` existe apenas no Terapia. O padrão veda presumir essas rotas em outros sistemas.
- **Quadro comparativo e faixa de implantação:** ausentes porque o Salas tem uma única modalidade e a implantação não é oferta aprovada deste produto.

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| Classes usadas sem regra no CSS | nenhuma (0 de 53) |
| Tags HTML | todas equilibradas |
| Recursos locais (CSS, JS, imagens) | 8 conferidos, nenhum ausente |
| Âncoras internas e `aria-labelledby` | 18 referências, todas com alvo |
| CSS via PostCSS | válido, 319 regras |
| Sintaxe dos scripts | `node --check` aprovado |
| Seções | rotina, módulos, privacidade, plano, faq |
| `git diff --check` | limpo |

## Limitações

- **Não houve validação visual renderizada.** O Chrome headless não inicia neste ambiente (bloqueio de pipes pelo sandbox). A conferência visual continua com o responsável.
- As três telas dos módulos exibem a mesma imagem; a leitura fica repetitiva até a troca pelas capturas reais.
- Alterações anteriores desta sessão continuam sem commit: componente `.offer-*` em `produtos.css`, conversões de Fit e Odonto e a atualização de CNPJ nas demais páginas.

## Estado final

- Status: página replicada e validada estruturalmente; aguardando conferência visual e imagens definitivas.
- Commit, push e publicação: não realizados. Nenhuma aprovação do responsável é declarada neste registro.

## Adendo — 11/11/2026, 11:34 — refino tonal para o sistema de referência

- Solicitação: "aplique um refinamento visual completo ajustando os tons da página ao sistema de referência".
- Na primeira replicação a paleta havia sido adaptada para marfim + azul-violeta. O responsável pediu alinhamento tonal com o Terapia, então a folha foi refeita a partir da referência.
- Ações:
  1. `gestao-salas.css` regenerado a partir de `gestao-terapia.css` com **apenas renomeação** de classes e variáveis, sem substituição de cores. Resultado: as mesmas 46 cores da referência, nenhuma faltando e nenhuma extra.
  2. Favicon do produto e ícone do modal reajustados para o verde da referência (`#84A897`/`#244236` e `#326956`), eliminando os últimos resquícios de índigo.
  3. Véu da abertura reescrito: a captura do Salas é escura, diferente da fotografia clara do Terapia, então o degradê agora fecha em 30% e só dissipa perto dos 88%, preservando leitura sobre a imagem sem lavá-la.
  4. Imagem de abertura ancorada ao topo, para mostrar os indicadores do dia em vez de cortá-los ao centro.
  5. Reaplicados os ajustes próprios do Salas que a regeneração descartou: card único centralizado e altura livre para as ofertas sem comparativo.
  6. Conferido que a marca no topo já herdava os tons da referência pela folha do produto.
- Verificações: CSS válido (322 regras), nenhuma classe usada sem regra, tags equilibradas, `git diff --check` limpo, conjunto de cores idêntico ao da referência.
- Limitação mantida: sem validação visual renderizada neste ambiente; conferência visual segue com o responsável.
