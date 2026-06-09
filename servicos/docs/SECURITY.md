# Seguranca e Privacidade

## Classificacao

| Nivel | Exemplos | Destino permitido |
| --- | --- | --- |
| Publico | catalogo, modelos publicados | pagina e banco publico controlado |
| Operacional | preferencias, estado de interface | navegador ou conta do usuario |
| Pessoal | curriculo, declaracoes, checklists | local por padrao; conta com consentimento |
| Sensivel | documentos fiscais, renda, identificadores | somente quando indispensavel e privado |
| Proibido | senha GOV.br, certificado, token, senha bancaria | nunca coletar ou armazenar |

## Controles obrigatorios

- RLS em toda tabela exposta pela Data API.
- Politicas separadas para SELECT, INSERT, UPDATE e DELETE.
- Indice em toda coluna usada frequentemente por RLS, especialmente `user_id`.
- Buckets privados para anexos.
- URLs assinadas curtas e geradas sob demanda.
- Chave publicavel no cliente; chave secreta apenas em ambiente servidor.
- Nenhuma autorizacao baseada em `user_metadata`.
- Funcoes `security definer` fora de schemas expostos.
- Validacao server-side em toda Edge Function.
- `verify_jwt = true` para funcoes chamadas por usuarios autenticados.
- Logs sem nome, CPF, conteudo de documento ou arquivo.

## Regras para arquivos

- Validar MIME type, extensao, assinatura e tamanho.
- Renomear uploads; nunca confiar no nome original.
- Usar caminho `user_id/recurso_id/arquivo`.
- Bloquear arquivos executaveis e formatos fora da lista permitida.
- Remover temporarios automaticamente.
- Documentar o prazo de retencao por recurso.

## Autenticacao

- Conta opcional para ferramentas locais.
- Magic link ou OTP na primeira versao.
- CAPTCHA em cadastro, recuperacao e endpoints publicos abusaveis.
- MFA para administradores.
- Reautenticacao para exclusao de conta e acoes sensiveis.

## Resposta a incidentes

1. Suspender a operacao afetada.
2. Preservar logs tecnicos sem ampliar a exposicao.
3. Revogar chaves ou sessoes comprometidas.
4. Identificar usuarios e dados impactados.
5. Corrigir, testar e registrar a causa.
6. Comunicar conforme obrigacoes legais aplicaveis.

## Checklist de liberacao

- [ ] Dados coletados sao estritamente necessarios.
- [ ] Processamento local foi preferido quando possivel.
- [ ] RLS foi testada com dois usuarios diferentes.
- [ ] Acesso anonimo foi testado.
- [ ] Exclusao e retencao foram testadas.
- [ ] Nenhum segredo esta no bundle.
- [ ] Advisors de seguranca e performance foram revisados.
