# Desenvolvimento

## Requisitos

- Node.js LTS.
- npm.
- Navegador moderno.
- Supabase CLI apenas quando as migracoes forem iniciadas.

## Primeira execucao

```powershell
cd servicos\hub
npm.cmd install
npm.cmd run dev
```

## Qualidade

```powershell
npm.cmd run lint
npm.cmd run test
npm.cmd run build
```

## Fluxo de uma ferramenta

1. Criar o manifesto.
2. Escrever um teste que falha para o primeiro comportamento.
3. Implementar o dominio minimo.
4. Criar a interface.
5. Validar limites, erros e acessibilidade.
6. Atualizar `ROADMAP.md`.
7. Ativar o card na pagina publica.

## Variaveis

Copiar `.env.example` para `.env.local`. O arquivo local nunca deve entrar no
Git.

Se as variaveis Supabase estiverem ausentes, o Hub entra em modo local. Se
apenas uma variavel estiver configurada, a aplicacao deve falhar no build ou
exibir erro de configuracao em desenvolvimento.

## Convencoes

- Nomes de arquivo e codigo em ingles.
- Textos da interface em portugues brasileiro.
- Uma responsabilidade principal por arquivo.
- Sem acesso direto ao Supabase dentro de componentes visuais.
- Sem console de dados pessoais.
