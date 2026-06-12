# Gerador de Declaracoes - Design

## Objetivo

Criar documentos orientados a partir de cinco modelos, com formulario adaptado,
pre-visualizacao A4 e download em PDF inteiramente no navegador.

## Modelos do MVP

1. Declaracao de residencia.
2. Declaracao de trabalho e renda.
3. Autorizacao para menor.
4. Recibo simples.
5. Declaracao personalizada.

## Arquitetura

- `domain/declaration-templates.ts`: catalogo, campos e recomendacoes.
- `domain/declaration-data.ts`: validacao e normalizacao dos valores.
- `domain/build-declaration.ts`: composicao do titulo, paragrafos e assinatura.
- `domain/create-declaration-pdf.ts`: geracao A4 com `pdf-lib`.
- `ui/DeclarationBuilderTool.tsx`: selecao, formulario, previa e download.
- `ui/declaration-builder.css`: estilos isolados.

## Privacidade

Todos os dados permanecem no estado do navegador. Nao ha autenticacao,
persistencia, analytics ou envio ao Supabase nesta etapa.

## Fora do Escopo

- Assinatura digital.
- Upload de documentos.
- Salvamento de rascunhos.
- Edicao livre de modelos juridicos.
- Publicacao da rota e ativacao do card institucional.
