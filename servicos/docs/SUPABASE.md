# Integracao Supabase

## Estado atual

A integracao esta preparada, mas desativada. Ainda nao ha credenciais,
migracoes aplicadas ou dependencia da nuvem para abrir o Hub.

## Variaveis do cliente

```dotenv
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_EXEMPLO
```

Usar a chave publicavel atual. As chaves legadas `anon` e `service_role`
continuam existentes durante a transicao do Supabase, mas novos projetos devem
preferir `sb_publishable_*` e `sb_secret_*`.

Nunca usar `sb_secret_*` ou `service_role` em variaveis prefixadas com `VITE_`.

## Sequencia de ativacao

1. Obter o project ref e a chave publicavel.
2. Configurar `.env.local` apenas no ambiente local.
3. Inicializar e vincular o Supabase CLI.
4. Criar migracao de `profiles` e testar RLS.
5. Criar migracao de `tool_projects` apenas na Fase 3.
6. Executar advisors de seguranca e performance.
7. Gerar tipos TypeScript a partir do schema.
8. Ativar Auth no Hub.

## Politica de schemas

- `public`: somente objetos realmente acessados pelo cliente.
- `private`: auditoria, rate limits e helpers privilegiados.
- Views expostas devem usar `security_invoker = true`.
- Funcoes privilegiadas ficam fora de schemas expostos.

## Edge Functions

- JWT verificado por padrao.
- Contexto do usuario propagado para consultas sujeitas a RLS.
- Chaves secretas somente em secrets da funcao.
- Webhooks sem JWT exigem autenticacao propria e justificativa documentada.

## Verificacao obrigatoria

Depois de qualquer DDL:

1. testar como usuario A;
2. testar como usuario B;
3. testar como anonimo;
4. revisar advisors;
5. confirmar grants da Data API;
6. registrar a migracao no Git.

## Credenciais necessarias no futuro

Para conectar este repositorio serao solicitados somente:

- project ref;
- URL do projeto;
- chave publicavel;
- autenticacao OAuth do conector ou CLI para aplicar migracoes.

Chaves secretas nao devem ser enviadas em conversa nem gravadas no repositorio.
