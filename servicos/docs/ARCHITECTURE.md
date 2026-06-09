# Arquitetura do Hub

## Objetivo

Construir ferramentas independentes que possam evoluir sem transformar a pagina
institucional em um unico arquivo de dificil manutencao.

## Fronteiras

### Pagina publica

`servicos.html` continua responsavel por apresentacao, navegacao, hero, catalogo
e rodape. Ela nao processa documentos nem conhece credenciais do Supabase.

### Aplicacao do Hub

`hub/` e uma aplicacao Vite, React e TypeScript. Cada ferramenta possui:

- manifesto com nome, categoria e politica de dados;
- pagina ou fluxo proprio;
- dominio e validadores proprios;
- testes proprios;
- dependencias carregadas apenas quando necessarias.

### Supabase

Supabase e uma dependencia opcional da aplicacao. A ausencia das variaveis de
ambiente nao pode impedir ferramentas locais de funcionar.

## Camadas

```text
src/
  app/                 composicao, navegacao e registro de ferramentas
  components/          componentes compartilhados sem regra de negocio
  features/tools/      um modulo por ferramenta
  lib/                 adaptadores externos, ambiente e utilitarios
  styles/              tokens e estilos globais
```

Dentro de uma ferramenta:

```text
features/tools/qr-code/
  manifest.ts          metadados e politica de dados
  domain/              tipos, validacao e transformacoes puras
  ui/                  fluxo visual
  tests/               comportamento do modulo
```

## Fluxos de dados

### Ferramenta local

```text
entrada do usuario -> validacao -> processamento em memoria -> download
```

Nenhum conteudo segue para Supabase, analytics ou logs.

### Rascunho consentido

```text
entrada local -> usuario escolhe salvar -> autenticacao -> RLS -> tool_projects
```

### Atendimento

```text
usuario autenticado -> Edge Function -> validacao -> banco/storage privado
```

Operacoes privilegiadas nao serao chamadas diretamente do navegador.

## Decisoes de framework

- Vite: build simples e adequado ao site estatico existente.
- React: composicao de fluxos e formularios progressivos.
- TypeScript: contratos para dados, ferramentas e integracoes.
- React Router: URLs independentes por ferramenta.
- Zod: validacao compartilhada entre formularios e adaptadores.
- Vitest + Testing Library: testes unitarios e de componentes.
- Supabase JS: Auth, Data API, Storage e Edge Functions quando ativados.

## Regras de dependencia

- Modulos nao importam internals de outras ferramentas.
- Bibliotecas pesadas de PDF e QR Code devem usar importacao dinamica.
- Componentes compartilhados nao acessam Supabase diretamente.
- A camada de dominio nao depende de React.
- O cliente Supabase nunca contem chave secreta.
