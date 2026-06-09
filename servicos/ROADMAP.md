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

Saida: base compilavel, sem autenticacao e sem conexao obrigatoria ao Supabase.

## Fase 1 - Ferramentas locais

Ordem:

1. Gerador de QR Code. Entregue em 9 de junho de 2026.
2. Imagens para PDF.
3. Unificador de PDFs.

### Gerador de QR Code

Status: disponivel.

- Modos: link, texto, WhatsApp, telefone, Wi-Fi e Pix Copia e Cola.
- Validacao de entradas e limites no navegador.
- Geracao e download PNG inteiramente locais.
- Pagina dedicada integrada ao card da pagina principal.
- Nenhum envio para a Plena ou para o Supabase.
- Testes automatizados, lint, build, auditoria e validacao visual aprovados.

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
3. Checklist MEI e IRPF.

O documento nasce localmente. O envio ao Supabase ocorre apenas quando o usuario
seleciona explicitamente `Salvar na minha conta`.

## Fase 4 - Atendimento assistido

- Solicitacoes de atendimento.
- Estados: recebido, em analise, aguardando usuario, concluido e cancelado.
- Anexos privados somente quando indispensaveis.
- URLs assinadas curtas.
- Painel interno e trilha de auditoria.
- Politica automatica de retencao e descarte.

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
