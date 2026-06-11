# Regras técnicas

Atualizado em: 11 de junho de 2026.

## Implementação

- Seguir padrões, tipos, componentes e organização existentes.
- Manter alterações limitadas ao escopo aprovado.
- Criar abstrações apenas quando reduzirem complexidade real.
- Preferir módulos de domínio puros para cálculos e geração de documentos.
- Usar APIs estruturadas em vez de manipulação textual improvisada.
- Manter comentários apenas onde a intenção não for evidente.
- Preservar acentuação em UTF-8.

## Testes

- Usar TDD para funcionalidades e correções.
- Testar comportamento público, não detalhes internos irrelevantes.
- Cobrir sucesso, entrada inválida, limites e falhas.
- Não chamar serviços reais em testes.
- Mockar Supabase, rede, downloads e APIs de navegador quando necessário.
- Não alterar testes apenas para esconder regressões.

## Validação mínima

Para mudanças no Hub:

```powershell
cd servicos\hub
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Também executar:

```powershell
git diff --check
```

Mudanças de UI exigem validação em:

- desktop amplo;
- 768 px;
- 375 px;
- 320 px;
- teclado;
- foco visível;
- redução de movimento quando aplicável.

## Segurança e privacidade

- Nunca colocar chave secreta em código cliente.
- Variáveis `VITE_` só podem conter valores publicáveis.
- Nunca coletar senha governamental, token fiscal ou código de acesso.
- Ferramentas de arquivos devem ser locais por padrão.
- URLs temporárias devem ser revogadas.
- Dados sensíveis não devem aparecer em logs ou fixtures.
- Supabase exige RLS nas tabelas expostas ao cliente.
- Links externos devem usar proteção apropriada.

## Conteúdo regulado

Ferramentas fiscais, contábeis, jurídicas ou trabalhistas:

- devem usar fontes oficiais atuais;
- devem registrar data de conferência;
- não podem prometer validade, aprovação ou resultado;
- não podem substituir profissional habilitado;
- não podem calcular valores fora do escopo aprovado.

## UI e UX

- Priorizar clareza e conclusão da tarefa.
- Manter alvos de toque adequados.
- Não depender apenas de cor.
- Formulários devem ter rótulos e mensagens acessíveis.
- Botões indisponíveis devem explicar o motivo.
- Prévia visual não substitui geração funcional.
- Estados vazios, carregamento e erro devem ser tratados.

## Dependências

Não instalar, remover ou atualizar dependências sem:

1. justificar a necessidade;
2. verificar se a stack atual já resolve o problema;
3. obter autorização do integrador;
4. executar testes e auditoria após a mudança.

## Arquivos gerados

- Não editar bundles minificados manualmente.
- Gerar assets pelo comando oficial de build.
- Não versionar `node_modules`, `dist`, coverage ou temporários.
- Confirmar que o build publicado corresponde ao código-fonte validado.
