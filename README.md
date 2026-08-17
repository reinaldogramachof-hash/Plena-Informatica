# Plena Informatica

Repositorio oficial do site institucional e dos produtos digitais da Plena
Informatica.

## Estrutura atual

- `index.html`: pagina inicial institucional.
- `assets/images/`: imagens publicas compartilhadas entre as paginas.
- `tecnologia/`: apresentacao das solucoes de tecnologia.
- `produtos/`: paginas dos sistemas e produtos digitais.
- `Sistemas_Gestao/`: demonstracoes de sistemas por segmento.
- `servicos/`: pagina de Servicos Digitais e novo Hub de ferramentas.
- `docs/`: documentacao, auditorias, estrategia, material comercial e arquivo historico.
- `tools/`: scripts locais e ferramentas de manutencao.
- `deploy/`: pacotes de publicacao e arquivos de deploy.

## Hub de Solucoes Digitais

O novo Hub esta sendo construido de forma modular em `servicos/hub`, mantendo a
pagina publica atual durante a migracao.

Documentos principais:

- `servicos/ROADMAP.md`
- `servicos/docs/ARCHITECTURE.md`
- `servicos/docs/SECURITY.md`
- `servicos/docs/SUPABASE.md`
- `servicos/docs/DEVELOPMENT.md`

### Executar o Hub

```powershell
cd servicos\hub
npm.cmd install
npm.cmd run dev
```

### Validar

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run build
npm.cmd audit
```

## Seguranca

- Credenciais e arquivos `.env` nao pertencem ao repositorio.
- Ferramentas de arquivos devem processar dados localmente sempre que possivel.
- Supabase sera ativado progressivamente com RLS e chave publicavel no cliente.
- Chaves secretas e credenciais governamentais nunca devem ser armazenadas no
  frontend.

## Contato

- Site: <https://plenainformatica.com.br>
- WhatsApp: +55 (12) 99219-1018
