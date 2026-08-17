# 2026-08-12 - Alinhamento WhatsApp Business com site

## Objetivo

Alinhar o perfil do WhatsApp Business e os CTAs do site da Plena Informática com a presença pública validada no WhatsApp Web.

## Ajustes executados no WhatsApp Business

- Descrição pública atualizada para:
  - "Sites, sistemas web, automações, produtos personalizados e serviços digitais em São José dos Campos. Atendimento humano e orçamento pelo WhatsApp."
- Horário de sexta-feira ajustado de 13:00-17:00 para 13:00-18:00, mantendo o padrão do site:
  - segunda a sexta: 13:00-18:00
  - sábado e domingo: fechado
- Site confirmado no perfil:
  - https://www.plenainformatica.com.br
- E-mail confirmado no perfil:
  - tecnologia@plenainformatica.com.br

## Número oficial validado

O WhatsApp Business autenticado exibe o número público:

- +55 12 99219-1018

Por isso, os CTAs e metadados do site foram ajustados para:

- E.164/links: 5512992191018
- Texto visível: (12) 99219-1018

## Ajustes executados no site local

- Atualizados links `wa.me`, `api.whatsapp.com` e `tel:` para o número validado no WhatsApp Business.
- Atualizados textos visíveis de contato para `(12) 99219-1018`.
- Atualizados metadados estruturados `telephone` e `sameAs` onde aplicável.
- Reconstruído `servicos/hub-app` a partir de `servicos/hub`.
- Atualizado artefato isolado do QR Code em `servicos/ferramentas/qr-code`.

## Validações

- Build do Hub concluído com sucesso.
- Teste focado do QR Code concluído com 9 testes aprovados.
- Varredura por números antigos nas pastas publicáveis não retornou resíduos, excluindo `.Agent`, `deploy`, `.git`, `.claude`, `tmp-caixa` e `node_modules`.

## Observações

- O endereço do perfil continua o que já estava cadastrado no WhatsApp Business; não foi alterado.
- Não foram enviadas mensagens nem abertas conversas.
- Worktrees antigos em `.claude` ainda contêm números antigos, mas não entram no pacote de publicação.
