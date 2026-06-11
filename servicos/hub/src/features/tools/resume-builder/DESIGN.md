# Criador de Curriculo - Design

## Objetivo

Criar um editor local de curriculo profissional com formulario orientado,
pre-visualizacao em tempo real e download em PDF.

## Escopo do MVP

- Dados pessoais e objetivo profissional.
- Experiencias profissionais.
- Formacao academica.
- Competencias.
- Um modelo visual profissional.
- Validacao local e limites de conteudo.
- Geracao de PDF inteiramente no navegador.

## Arquitetura

- `domain/resume-data.ts`: tipos, limites e validacao com Zod.
- `domain/create-resume-pdf.ts`: composicao do documento com `pdf-lib`.
- `ui/ResumeBuilderTool.tsx`: formulario, secoes dinamicas, previa e download.
- `ui/resume-builder.css`: estilos isolados da ferramenta.

O formulario mantem os dados apenas no estado do componente. Nenhum dado e
enviado, persistido ou registrado.

## Validacao

- Nome, contato e objetivo possuem limites explicitos.
- Experiencias e formacoes exigem campos essenciais quando adicionadas.
- Competencias vazias sao ignoradas.
- O download so e liberado depois que os dados obrigatorios forem validos.

## Fora do Escopo

- Autenticacao e Supabase.
- Salvamento de rascunhos.
- Foto do candidato.
- Multiplos modelos visuais.
- Importacao de curriculo existente.
- Publicacao de rota e ativacao do card institucional.
