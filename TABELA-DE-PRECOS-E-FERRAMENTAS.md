# Plena Informática — Tabela de Preços e Análise de Ferramentas Digitais

_Atualizado em: junho de 2026_

---

## Tabela de Preços

### Impressões, cópias e digitação

| Serviço                 | Valor              |
| ----------------------- | -----------------: |
| Digitação e impressão   | R$ 10,00           |
| Digitação               | R$ 6,00            |
| Etiquetas em preto      | R$ 3,50            |
| Xerox                   | R$ 1,00 / R$ 2,00  |
| Impressão preto         | R$ 3,00            |
| Impressão colorida      | R$ 4,00            |
| Papel opaline / similar | R$ 8,00            |
| Foto / adesivo / glossy | R$ 10,00           |

### Cardápios plastificados

| Serviço                     | Valor    |
| --------------------------- | -------: |
| Meio sulfite frente e verso | R$ 30,00 |
| Cardápio A4 frente e verso  | R$ 50,00 |

### Documentos e serviços digitais

| Serviço                         | Valor     |
| ------------------------------- | --------: |
| Currículo                       | R$ 15,00  |
| Declaração / orçamento / recibo | R$ 15,00  |
| Contrato                        | R$ 25,00  |
| Procuração                      | R$ 20,00  |
| 2ª via                          | R$ 5,00   |
| Digitalização                   | R$ 4,00   |
| Atestado de antecedentes        | R$ 10,00  |
| IRPF                            | R$ 110,00 |
| ITR                             | R$ 50,00  |
| Boletim de ocorrência           | R$ 25,00  |
| Nota NFSE                       | R$ 30,00  |
| Agendamento                     | R$ 10,00  |
| Entrada benefício INSS          | R$ 200,00 |

### Acabamentos e materiais impressos

| Serviço                             | Valor             |
| ----------------------------------- | ----------------: |
| Plastificação                       | R$ 5,00 / R$ 8,00 |
| Encadernação A4 até 100 folhas      | R$ 10,00          |
| Encadernação A4 acima de 100 folhas | R$ 15,00          |
| Cartão de visitas — cento           | R$ 50,00          |

### MEI

| Serviço        | Valor     |
| -------------- | --------: |
| MEI abertura   | R$ 140,00 |
| MEI baixa      | R$ 140,00 |
| MEI declaração | R$ 80,00  |

---

## Análise de Ferramentas Digitais

A seguir, cada serviço do escritório é analisado quanto ao potencial de gerar uma
ferramenta digital no Hub — seja para o cliente se preparar antes do atendimento,
seja para automatizar parte do trabalho interno.

---

### Ferramentas já implementadas (ou em construção)

| Ferramenta                  | Slug                  | Status       | Relação com os serviços                                                  |
| --------------------------- | --------------------- | ------------ | ------------------------------------------------------------------------ |
| Gerador de QR Code          | `qr-code`             | Disponível   | Apoio a cardápios, cartões de visita, links de contato                   |
| Imagens para PDF            | `images-to-pdf`       | Disponível   | Digitalização → PDF, montagem de documentos para entrega                 |
| Unificador de PDFs          | `merge-pdf`           | Disponível   | Juntar comprovantes, CNHs, RGs, contratos em um único arquivo            |
| Criador de Currículo        | `resume-builder`      | Disponível   | Substitui parcialmente o serviço de currículo presencial (R$ 15,00)      |
| Gerador de Declarações      | `declaration-builder` | Em construção| Declaração / orçamento / recibo (R$ 15,00)                               |
| Checklist MEI e IRPF        | `mei-irpf-checklist`  | Em construção| Organização prévia para MEI e IRPF — reduz tempo de atendimento          |

---

### Ferramentas novas identificadas

As sugestões abaixo nascem diretamente dos serviços já prestados. São ordenadas por
facilidade de implementação e impacto imediato no cliente.

---

#### 1. Gerador de Cartão de Visitas (Digital)

**Relação:** Cartão de visitas — cento (R$ 50,00)
**Audiência:** Autônomos, MEIs, prestadores de serviço

**Descrição:**
O cliente preenche nome, cargo, telefone, e-mail, endereço e redes sociais.
A ferramenta gera um cartão de visitas digital em alta resolução, pronto para
enviar por WhatsApp ou imprimir em casa para provas de layout.
O arquivo final (PDF ou PNG) é gerado localmente.
A impressão física continua sendo feita na Plena, com o arquivo já aprovado pelo
cliente — reduzindo retrabalho e trocas de mensagem.

**Tecnologia:** React + pdf-lib (já instalado) ou Canvas API
**Privacidade:** 100% local, sem upload
**Novo slug sugerido:** `business-card-creator`

---

#### 2. Gerador de Recibo / Orçamento / Declaração (aprimorado)

**Relação:** Declaração / orçamento / recibo (R$ 15,00)
**Audiência:** Clientes que precisam de documento simples, autônomos, MEIs

**Descrição:**
O `declaration-builder` já está em construção. Vale ampliar seu escopo para cobrir
os três tipos de documento que a Plena faz por R$ 15,00:

- **Recibo de pagamento** — prestador, tomador, serviço, valor, data
- **Orçamento** — empresa, cliente, itens, validade
- **Declaração simples** — texto livre com assinatura de local e data

Todos gerados em PDF via pdf-lib, sem necessidade de impressão ou digitação no balcão
para casos simples. Para documentos mais elaborados (contratos, procurações), o
atendimento presencial continua sendo a indicação.

**Tecnologia:** Extensão natural do `declaration-builder` já iniciado
**Novo slug sugerido:** integrado ao `declaration-builder` ou `receipt-generator`

---

#### 3. Simulador de Economia de Impressão

**Relação:** Impressão preto (R$ 3,00), colorida (R$ 4,00), xerox (R$ 1,00–R$ 2,00)
**Audiência:** Empresas, condomínios, comércios que imprimem regularmente

**Descrição:**
O cliente informa quantas páginas imprime por mês (preto e colorido) e o custo atual
(impressora própria + toner + papel + manutenção). A ferramenta mostra quanto
custaria terceirizar para a Plena, comparando os dois cenários.
Não é um calculador de preço — é um organizador de percepção de custo.

**Tecnologia:** React puro, sem pdf-lib
**Privacidade:** 100% local, sem armazenar valores
**Observação editorial:** Não exibir preços da concorrência, apenas comparar com
  estimativas genéricas de custo de impressão doméstica.
**Novo slug sugerido:** `print-cost-estimator`

---

#### 4. Gerador de Cardápio (PDF)

**Relação:** Cardápio A4 frente e verso (R$ 50,00), meio sulfite (R$ 30,00)
**Audiência:** Restaurantes, lanchonetes, bares, deliveries locais

**Descrição:**
O cliente cadastra nome do estabelecimento, categorias (Entradas, Pratos, Bebidas,
Sobremesas) e itens com nome, descrição breve e preço opcional.
A ferramenta gera um PDF A4 frente-e-verso com layout pronto para impressão.
O arquivo é baixado localmente. O cliente imprime em casa para aprovação e leva à
Plena para a plastificação final (R$ 5,00–R$ 8,00).

**Tecnologia:** React + pdf-lib
**Privacidade:** 100% local
**Sinergia de serviço:** A ferramenta atrai o cliente para o serviço de impressão
  e plastificação presencial.
**Novo slug sugerido:** `menu-builder`

---

#### 5. Calculadora de DAS MEI (orientativa)

**Relação:** MEI declaração (R$ 80,00), MEI abertura/baixa (R$ 140,00)
**Audiência:** MEIs e futuros MEIs

**Descrição:**
Informa ao MEI os valores mensais do DAS para cada categoria de atividade (comércio,
serviços, transporte) — sem calcular impostos nem substituir o contador.
Apresenta apenas os valores fixos tabelados pelo governo para o exercício atual,
com aviso de que os valores são reajustados anualmente e devem ser confirmados
no Portal do Empreendedor.
Inclui botão para acessar o Portal diretamente (gov.br).

**Tecnologia:** React puro, tabela estática com nota de atualização anual
**Atenção editorial:** Somente valores do DAS fixo tabelado. Sem cálculo de INSS
  proporcional, sem projeções, sem limites de faturamento.
**Novo slug sugerido:** `mei-das-guide`

---

#### 6. Preparador de Documentos para IRPF

**Relação:** IRPF (R$ 110,00)
**Audiência:** Pessoas físicas que precisam organizar documentos antes do atendimento

**Descrição:**
Extensão natural do `mei-irpf-checklist` já em construção.
A ideia aqui é criar um fluxo específico de IRPF que gera uma lista de documentos
personalizada **e** um PDF imprimível que o cliente leva ao atendimento —
substituindo o briefing verbal feito hoje no balcão.
Reduz o tempo médio de atendimento IRPF e diminui esquecimentos de documentos.

**Tecnologia:** React + pdf-lib (checklist → exportar como PDF)
**Integração:** Pode ser uma extensão do `mei-irpf-checklist` com output em PDF
**Novo slug sugerido:** extensão do `mei-irpf-checklist` ou `irpf-doc-pack`

---

#### 7. Gerador de Etiquetas

**Relação:** Etiquetas em preto (R$ 3,50)
**Audiência:** Comércios, escolas, condomínios, pequenas empresas

**Descrição:**
O cliente digita o conteúdo das etiquetas (nome, endereço, código, produto),
escolhe o formato da folha (padrão A4, layout 2×6 ou 3×9) e baixa um PDF
pronto para impressão em papel etiqueta.
A impressão na Plena usa papel etiqueta padrão (R$ 3,50).

**Tecnologia:** React + pdf-lib
**Privacidade:** 100% local
**Novo slug sugerido:** `label-generator`

---

### Mapa de prioridades

| Prioridade | Ferramenta                        | Esforço estimado | Impacto no cliente |
| :--------: | --------------------------------- | :--------------: | :----------------: |
| 1          | Gerador de Recibo / Orçamento     | Baixo (extensão) | Alto               |
| 2          | Preparador IRPF (output PDF)      | Baixo (extensão) | Alto               |
| 3          | Gerador de Cardápio               | Médio            | Alto               |
| 4          | Gerador de Cartão de Visitas      | Médio            | Alto               |
| 5          | Gerador de Etiquetas              | Médio            | Médio              |
| 6          | Guia DAS MEI                      | Baixo            | Médio              |
| 7          | Simulador de Economia de Impressão| Baixo            | Médio              |

---

### Regras para todas as novas ferramentas

1. **100% local no navegador** — nenhum arquivo sai do dispositivo do cliente.
2. **Sem dados sensíveis** — sem CPF, CNPJ, senha, token, código de acesso.
3. **Sem cálculo tributário** — nenhuma ferramenta estima imposto, multa ou restituição.
4. **Sem promessa de resultado** — a Plena organiza, não substitui o profissional habilitado.
5. **Aviso obrigatório** em todas as ferramentas que tocam temas fiscais, trabalhistas
   ou jurídicos: _"Este resultado ajuda a organizar informações e não substitui
   orientação contábil, fiscal ou jurídica."_
6. **Sinergia presencial** — cada ferramenta digital deve gerar valor ao cliente E
   aumentar a chance de ele voltar ao escritório para o serviço físico correspondente.

---

_Este documento é interno. Não publicar na página pública sem revisão._
