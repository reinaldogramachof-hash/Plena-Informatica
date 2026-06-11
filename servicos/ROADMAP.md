# Roadmap do Hub de Solucoes Digitais

## Principios

1. Resolver localmente tudo o que nao precisa sair do dispositivo.
2. Exigir autenticacao apenas quando ela gerar valor claro ao usuario.
3. Nunca armazenar credenciais governamentais, fiscais ou bancarias.
4. Liberar uma ferramenta por vez, com testes e criterios de aceite proprios.
5. Usar Supabase somente para identidade, rascunhos consentidos, atendimento e
   auditoria.

## Fase 0 - Fundacao

Status: em andamento.

- Aplicacao React + TypeScript isolada em `hub/`.
- Registro central das ferramentas.
- Contratos de classificacao e persistencia de dados.
- Testes unitarios com Vitest.
- Documentacao de arquitetura, seguranca e Supabase.
- Pipeline local de lint, testes e build.
- Sistema visual compartilhado para cards e paginas de ferramentas.
- Metadados centralizados de beneficios, tempo, privacidade e atendimento.
- Busca e filtros acessiveis na vitrine institucional.

Saida: base compilavel, sem autenticacao e sem conexao obrigatoria ao Supabase.

### Padronizacao de UI e UX

Status: implementada em 10 de junho de 2026.

- Direcao visual orientada por beneficios aplicada a todas as ferramentas.
- Extensao comercial contextual apenas quando existe servico profissional.
- CTA da ferramenta sempre prioritario em relacao ao atendimento.
- Precos profissionais centralizados e identificados como servico adicional.
- Cabecalho, privacidade, beneficios e area de trabalho compartilhados nas rotas.
- Cards responsivos, com alvos de toque, foco visivel e reducao de conteudo no
  celular.
- Busca por texto, filtros por categoria, contador e estado vazio.
- Ferramentas em construcao permanecem com CTA desabilitado.

## Fase 1 - Ferramentas locais

Ordem:

1. Gerador de QR Code. Entregue em 9 de junho de 2026.
2. Imagens para PDF. Entregue em 10 de junho de 2026.
3. Unificador de PDFs. Entregue em 10 de junho de 2026.

### Gerador de QR Code

Status: disponivel.

- Modos: link, texto, WhatsApp, telefone, Wi-Fi e Pix Copia e Cola.
- Validacao de entradas e limites no navegador.
- Geracao e download PNG inteiramente locais.
- Pagina dedicada integrada ao card da pagina principal.
- Nenhum envio para a Plena ou para o Supabase.
- Testes automatizados, lint, build, auditoria e validacao visual aprovados.

### Imagens para PDF

Status: disponivel.

- Selecao, ordenacao e remocao de imagens JPEG e PNG.
- Configuracao de orientacao e margem em pagina A4.
- Geracao e download do PDF inteiramente locais.
- Limites de quantidade, tamanho individual e tamanho total.
- Pagina integrada ao card da pagina principal.
- Testes automatizados, lint, build e validacao local aprovados.

### Unificador de PDFs

Status: disponivel.

- Selecao, ordenacao e remocao de documentos PDF.
- Leitura da quantidade de paginas de cada arquivo.
- Validacao de formato, arquivos vazios, corrompidos ou protegidos.
- Preservacao da ordem e das dimensoes originais das paginas.
- Geracao e download do documento unificado inteiramente locais.
- Pagina integrada ao card da pagina principal.
- Testes automatizados, lint, build e validacao local aprovados.

Requisitos comuns:

- Processamento no navegador.
- Nenhum upload remoto.
- Limites de tamanho e quantidade.
- Aviso claro sobre processamento local.
- Limpeza de memoria e URLs temporarias ao sair.
- Testes de entradas validas, invalidas e limites.

## Fase 2 - Conta opcional

- Login por magic link ou OTP de e-mail.
- Perfil minimo.
- Sessao e recuperacao de acesso.
- CAPTCHA nas rotas publicas sujeitas a abuso.
- Exclusao da conta e dos dados.
- MFA obrigatorio para administradores.

O uso das ferramentas locais continuara disponivel sem conta.

## Fase 3 - Documentos com rascunho

Ordem:

1. Criador de Curriculo.
2. Gerador de Declaracoes.
3. Checklist MEI e IRPF. Entregue em 10 de junho de 2026.

O documento nasce localmente. O envio ao Supabase ocorre apenas quando o usuario
seleciona explicitamente `Salvar na minha conta`.

### Checklist MEI e IRPF

Status: disponivel.

- Fluxos orientados para MEI e Imposto de Renda Pessoa Fisica.
- Seis cenarios MEI com checklists especificos por necessidade.
- Perguntas condicionais e organizacao dos itens por categoria.
- Marcacao de documentos separados e acompanhamento de progresso.
- Impressao ou salvamento em PDF pelo recurso nativo do navegador.
- Nenhuma coleta de CPF, CNPJ, senha, token ou credencial governamental.
- Processamento local, sem Supabase, login ou armazenamento remoto nesta etapa.
- Testes automatizados, lint, build e auditoria de codificacao aprovados.

## Fase 4 - Atendimento assistido

- Solicitacoes de atendimento.
- Estados: recebido, em analise, aguardando usuario, concluido e cancelado.
- Anexos privados somente quando indispensaveis.
- URLs assinadas curtas.
- Painel interno e trilha de auditoria.
- Politica automatica de retencao e descarte.

## Novas ferramentas em construcao

As bases visuais abaixo estao integradas ao registro e as rotas, mas seus cards
continuam indisponiveis ate a implementacao e validacao da logica:

1. Gerador de Cardapio.
2. Gerador de Cartao de Visitas.
3. Gerador de Etiquetas.
4. Guia DAS MEI.
5. Calculadora de Impressao.

## Fase 5 - Escala

- Metricas de uso sem conteudo de documentos.
- Limites por usuario e por IP nas operacoes remotas.
- Planos e cotas, se houver validacao comercial.
- Observabilidade de erros.
- Revisoes periodicas de RLS e advisors do Supabase.

## Criterio para ativar um card

Um card so deixa o estado `Em breve` quando:

- testes automatizados passam;
- build de producao passa;
- revisao de privacidade foi concluida;
- limites e mensagens de erro foram definidos;
- comportamento mobile foi validado;
- documentacao da ferramenta foi atualizada.
