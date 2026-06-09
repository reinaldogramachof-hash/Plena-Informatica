# Hub Foundation Design

## Objetivo

Criar uma fundacao modular e segura para seis ferramentas digitais, preservando
a pagina publica existente e adiando autenticacao e persistencia ate que sejam
necessarias.

## Decisao

A aplicacao sera criada em `servicos/hub` com Vite, React e TypeScript. A pagina
`servicos/servicos.html` permanece ativa durante a migracao progressiva.

Cada ferramenta e registrada por um manifesto que declara categoria, estado,
modo de processamento, necessidade de conta e politica de persistencia.

## Modulos iniciais

- QR Code: local, primeira implementacao funcional.
- Imagens para PDF: local.
- Unificador de PDFs: local.
- Criador de Curriculo: local com salvamento opcional futuro.
- Gerador de Declaracoes: local com salvamento opcional futuro.
- Checklist MEI/IRPF: local com atendimento opcional futuro.

## Supabase

O cliente e opcional e so e criado quando URL e chave publicavel validas
existirem. Nenhuma chave secreta sera aceita no frontend. Banco, Storage e Edge
Functions serao introduzidos por migracoes versionadas nas fases correspondentes.

## Seguranca

Arquivos permanecem locais por padrao. Dados persistidos exigem consentimento,
autenticacao e RLS. Credenciais de terceiros sao proibidas.

## Validacao

A fundacao deve passar em testes do registro das ferramentas, verificacao de
ambiente, lint e build de producao antes da primeira ferramenta.
