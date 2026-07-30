# F9 - frentes de risco: working tree e AdminApp

Data: 2026-07-29 23:12  
Agente: Codex  
Escopo solicitado: Tarefa 1 (higiene da working tree) e Tarefa 2 (root-cause da falha de isolamento em `src/admin/auth/AdminApp.test.tsx`)  
Restricoes respeitadas: sem commit; sem restaurar/descartar arquivos; sem tocar nas tarefas 3/4 delegadas ao Antigravity; sem tocar na tarefa 5 de lint/whitespace/cobertura.

## Resumo

- A working tree continua suja e mistura F9, bundles, delecoes suspeitas e outras alteracoes.
- Foram categorizadas todas as entradas atuais de `git status --short`.
- As 180 delecoes em `Sistemas_Gestao` com acento no output do Git aparecem como delecoes reais contra `HEAD`, todas com ultimo commit `1296792 chore: initialize Plena Informatica repository`.
- Existe tambem a pasta `Sistemas_Gestao` sem acento no disco, rastreada e limpa para os mesmos exemplos testados. Isso sugere risco de problema de encoding/nome de pasta e torna perigoso restaurar/limpar automaticamente sem decisao humana.
- `hero.mp4` e `logo-plena.png` tambem aparecem como delecoes suspeitas fora do F9; ultimo commit relevante `77ef2d6`.
- A falha antiga de `AdminApp.test.tsx` nao reproduziu hoje: a suite completa foi rodada 2 vezes e `AdminApp.test.tsx` nao falhou em nenhuma delas.
- A suite completa segue vermelha de forma deterministica por 3 arquivos fora de `AdminApp`: `src/app/institutional-integration.test.tsx`, `src/features/tools/mei-das-guide/domain/das-values.test.ts`, `src/features/tools/mei-das-guide/ui/MeiDasGuideTool.test.tsx`.
- Nao apliquei correcao de codigo, porque nao havia causa raiz reproduzivel em `AdminApp.test.tsx` e corrigir `institutional-integration` ou `mei-das-guide` sairia do escopo/tarefa 5.

## Tarefa 1 - Working tree

### Comando: `git status --short` inicial

Output bruto observado no inicio da rodada, com aviso do Git:

```text
warning: unable to access 'C:\Users\reina/.config/git/ignore': Permission denied
 D Sistemas_Gestao/_design-system.md
 D Sistemas_Gestao/_device-classification.md
 D Sistemas_Gestao/gestao-alugueis/assets/css/styles.css
 D Sistemas_Gestao/gestao-alugueis/assets/js/tailwind_config.js
 D Sistemas_Gestao/gestao-alugueis/icon.svg
 D Sistemas_Gestao/gestao-alugueis/index.html
 ...
 D Sistemas_Gestao/gestao-terapia/sw.js
 D hero.mp4
 D logo-plena.png
 D servicos/hub-app/assets/index-DSj2oNcD.js
 D servicos/hub-app/assets/index-KILtb9Kn.css
 M servicos/hub-app/index.html
 M servicos/hub/index.html
 M servicos/hub/package-lock.json
 M servicos/hub/package.json
 M servicos/hub/src/App.tsx
 M servicos/hub/src/features/office/services/office-service.ts
 M servicos/hub/src/features/office/ui/OfficeAreaPage.test.tsx
 M servicos/hub/src/features/office/ui/OfficeAreaPage.tsx
 M servicos/hub/src/styles/app.css
?? .Agent/REGISTROS/2026-07-29-2244-codex-auditoria-f9-escritorio.md
?? graphify-out/
?? servicos/hub-app/assets/AdminProposalsPage-B0fAH8M7.js
?? servicos/hub-app/assets/BusinessCardCreatorTool-CV8uIRSr.js
?? servicos/hub-app/assets/BusinessCardCreatorTool-DHu5URTi.css
?? servicos/hub-app/assets/ClientProposalPage-DnhSVO68.js
?? servicos/hub-app/assets/DeclarationBuilderTool-C3pIq2XP.js
?? servicos/hub-app/assets/DeclarationBuilderTool-CFBqTC19.css
?? servicos/hub-app/assets/ImagesToPdfTool-C0KdSmzU.js
?? servicos/hub-app/assets/ImagesToPdfTool-C3Qx_0pE.css
?? servicos/hub-app/assets/LabelGeneratorTool-CDn86eqx.js
?? servicos/hub-app/assets/LabelGeneratorTool-DrPNKHHB.css
?? servicos/hub-app/assets/MeiDasGuideTool-DaJ7o6Zo.js
?? servicos/hub-app/assets/MeiDasGuideTool-HYVUoltl.css
?? servicos/hub-app/assets/MeiIrpfChecklistTool-BCnQfN0r.js
?? servicos/hub-app/assets/MeiIrpfChecklistTool-DZsNthLL.css
?? servicos/hub-app/assets/MenuBuilderTool-D0Bx0ywr.css
?? servicos/hub-app/assets/MenuBuilderTool-DRuL4oYE.js
?? servicos/hub-app/assets/MergePdfTool-CUlq_Ohr.css
?? servicos/hub-app/assets/MergePdfTool-DugmPen4.js
?? servicos/hub-app/assets/OfficeAreaPage-0nwqnfCr.js
?? servicos/hub-app/assets/PrintCostEstimatorTool-D8G8CVLE.js
?? servicos/hub-app/assets/PrintCostEstimatorTool-ZN9Cp0pq.css
?? servicos/hub-app/assets/QrCodeTool-B9kTNtrj.js
?? servicos/hub-app/assets/ResumeBuilderTool-CTJ5pcju.css
?? servicos/hub-app/assets/ResumeBuilderTool-E4mm64S-.js
?? servicos/hub-app/assets/chunk-QTnfLwEv.js
?? servicos/hub-app/assets/es-D9b0asL_.js
?? servicos/hub-app/assets/index-CVhFtCmV.js
?? servicos/hub-app/assets/index-jwDQjZXM.css
?? servicos/hub-app/assets/proposals-Csju0YuL.js
?? servicos/hub-app/assets/proposals-DQXe8PUD.css
?? servicos/hub-app/assets/use-local-storage-C3vDw7zi.js
?? servicos/hub/postcss.config.js
?? servicos/hub/src/features/office/ui/components/
?? servicos/hub/src/features/office/ui/utils.ts
?? servicos/hub/tailwind.config.js
```

### Comando: categorizacao por status

```powershell
$status = git status --porcelain=v1
# cada linha foi classificada por prefixo/caminho
```

Output bruto:

```text
[a) mudanca legitima do F9] 7
 M servicos/hub/src/App.tsx
 M servicos/hub/src/features/office/services/office-service.ts
 M servicos/hub/src/features/office/ui/OfficeAreaPage.test.tsx
 M servicos/hub/src/features/office/ui/OfficeAreaPage.tsx
?? servicos/hub/src/features/office/ui/components/
?? servicos/hub/src/features/office/ui/sedK0ogzO
?? servicos/hub/src/features/office/ui/utils.ts

[b) build/bundle gerado (esperado)] 34
 D servicos/hub-app/assets/index-DSj2oNcD.js
 D servicos/hub-app/assets/index-KILtb9Kn.css
 M servicos/hub-app/index.html
?? servicos/hub-app/assets/AdminProposalsPage-B0fAH8M7.js
?? servicos/hub-app/assets/BusinessCardCreatorTool-CV8uIRSr.js
?? servicos/hub-app/assets/BusinessCardCreatorTool-DHu5URTi.css
?? servicos/hub-app/assets/ClientProposalPage-DnhSVO68.js
?? servicos/hub-app/assets/DeclarationBuilderTool-C3pIq2XP.js
?? servicos/hub-app/assets/DeclarationBuilderTool-CFBqTC19.css
?? servicos/hub-app/assets/ImagesToPdfTool-C0KdSmzU.js
?? servicos/hub-app/assets/ImagesToPdfTool-C3Qx_0pE.css
?? servicos/hub-app/assets/LabelGeneratorTool-CDn86eqx.js
?? servicos/hub-app/assets/LabelGeneratorTool-DrPNKHHB.css
?? servicos/hub-app/assets/MeiDasGuideTool-DaJ7o6Zo.js
?? servicos/hub-app/assets/MeiDasGuideTool-HYVUoltl.css
?? servicos/hub-app/assets/MeiIrpfChecklistTool-BCnQfN0r.js
?? servicos/hub-app/assets/MeiIrpfChecklistTool-DZsNthLL.css
?? servicos/hub-app/assets/MenuBuilderTool-D0Bx0ywr.css
?? servicos/hub-app/assets/MenuBuilderTool-DRuL4oYE.js
?? servicos/hub-app/assets/MergePdfTool-CUlq_Ohr.css
?? servicos/hub-app/assets/MergePdfTool-DugmPen4.js
?? servicos/hub-app/assets/OfficeAreaPage-0nwqnfCr.js
?? servicos/hub-app/assets/PrintCostEstimatorTool-D8G8CVLE.js
?? servicos/hub-app/assets/PrintCostEstimatorTool-ZN9Cp0pq.css
?? servicos/hub-app/assets/QrCodeTool-B9kTNtrj.js
?? servicos/hub-app/assets/ResumeBuilderTool-CTJ5pcju.css
?? servicos/hub-app/assets/ResumeBuilderTool-E4mm64S-.js
?? servicos/hub-app/assets/chunk-QTnfLwEv.js
?? servicos/hub-app/assets/es-D9b0asL_.js
?? servicos/hub-app/assets/index-CVhFtCmV.js
?? servicos/hub-app/assets/index-jwDQjZXM.css
?? servicos/hub-app/assets/proposals-Csju0YuL.js
?? servicos/hub-app/assets/proposals-DQXe8PUD.css
?? servicos/hub-app/assets/use-local-storage-C3vDw7zi.js

[c) delecao suspeita nao relacionada ao F9] 182
 D Sistemas_Gestao/_design-system.md
 D Sistemas_Gestao/_device-classification.md
 D Sistemas_Gestao/gestao-alugueis/assets/css/styles.css
 ...
 D Sistemas_Gestao/gestao-terapia/sw.js
 D hero.mp4
 D logo-plena.png

[d) outra coisa] 11
 M servicos/ROADMAP.md
 M servicos/docs/DATA_MODEL.md
 M servicos/hub/index.html
 M servicos/hub/package-lock.json
 M servicos/hub/package.json
 M servicos/hub/src/styles/app.css
?? .Agent/REGISTROS/2026-07-29-2244-codex-auditoria-f9-escritorio.md
?? .Agent/REGISTROS/2026-07-29-2315-antigravity-resolucao-pendencias-f9-escritorio.md
?? graphify-out/
?? servicos/hub/postcss.config.js
?? servicos/hub/tailwind.config.js
```

Observacao: `servicos/hub/src/features/office/ui/sedK0ogzO` apareceu como untracked durante a rodada. O conteudo e muito parecido com `OfficeAreaPage.tsx`, mas nao foi criado por mim nesta rodada e nao foi alterado. Mantive sem acao.

### Comandos de investigacao de path/encoding

```powershell
Get-ChildItem -Name | Sort-Object
Test-Path "Sistemas_Gestao"; Test-Path "Sistemas_Gestao"; Test-Path "Sistemas_Gestao"
git status --short --untracked-files=all -- Sistemas_Gestao
git ls-files -- Sistemas_Gestao | Select-Object -First 40
git diff --name-status -- "Sistemas_Gestao/_design-system.md" "Sistemas_Gestao/gestao-alugueis/index.html"
git diff --name-status -- "Sistemas_Gestao/_design-system.md" "Sistemas_Gestao/gestao-alugueis/index.html"
```

Output bruto relevante:

```text
Sistemas_Gestao
...
False
True
False

git status --short --untracked-files=all -- Sistemas_Gestao
[sem output]

git ls-files -- Sistemas_Gestao | Select-Object -First 40
Sistemas_Gestao/_design-system.md
Sistemas_Gestao/_device-classification.md
Sistemas_Gestao/gestao-alugueis/assets/css/styles.css
Sistemas_Gestao/gestao-alugueis/assets/js/tailwind_config.js
Sistemas_Gestao/gestao-alugueis/icon.svg
Sistemas_Gestao/gestao-alugueis/index.html
...

git diff --name-status -- "Sistemas_Gestao/_design-system.md" "Sistemas_Gestao/gestao-alugueis/index.html"
[sem output]

git diff --name-status -- "Sistemas_Gestao/_design-system.md" "Sistemas_Gestao/gestao-alugueis/index.html"
D	Sistemas_Gestao/_design-system.md
D	Sistemas_Gestao/gestao-alugueis/index.html
```

Conclusao: ha discrepancia de representacao do nome da pasta no terminal/Git. Exemplos sem acento aparecem limpos; os caminhos com acento aparecem deletados contra `HEAD`. Isso precisa de decisao humana antes de qualquer checkout/restauracao para evitar duplicacao ou perda de paths.

### Comando: investigacao de todas as delecoes em `Sistemas_Gestao`

```powershell
git status --short
$deleted = git status --porcelain=v1 | Where-Object { $_ -like ' D Sistemas_Gestao/*' } | ForEach-Object { $_.Substring(3) }
"TOTAL_DELECOES_SISTEMAS_GESTAO=$($deleted.Count)"
foreach ($path in $deleted) {
  "--- PATH: $path"
  "git log --oneline -5 -- $path"; git log --oneline -5 -- $path
  "git diff --name-status HEAD -- $path"; git diff --name-status HEAD -- $path
  "git diff --shortstat HEAD -- $path"; git diff --shortstat HEAD -- $path
}
"--- STATUS AFTER INVESTIGATION"; git status --short
```

Output bruto compactado:

```text
TOTAL_DELECOES_SISTEMAS_GESTAO=180
Sistemas_Gestao/_design-system.md | LOG=1296792 chore: initialize Plena Informatica repository | DIFF=D Sistemas_Gestao/_design-system.md | SHORTSTAT=1 file changed, 260 deletions(-)
Sistemas_Gestao/_device-classification.md | LOG=1296792 chore: initialize Plena Informatica repository | DIFF=D Sistemas_Gestao/_device-classification.md | SHORTSTAT=1 file changed, 107 deletions(-)
Sistemas_Gestao/gestao-alugueis/assets/css/styles.css | LOG=1296792 chore: initialize Plena Informatica repository | DIFF=D Sistemas_Gestao/gestao-alugueis/assets/css/styles.css | SHORTSTAT=1 file changed, 341 deletions(-)
Sistemas_Gestao/gestao-alugueis/index.html | LOG=1296792 chore: initialize Plena Informatica repository | DIFF=D Sistemas_Gestao/gestao-alugueis/index.html | SHORTSTAT=1 file changed, 5059 deletions(-)
...
Sistemas_Gestao/gestao-terapia/assets/css/styles.css | LOG=1296792 chore: initialize Plena Informatica repository | DIFF=D Sistemas_Gestao/gestao-terapia/assets/css/styles.css | SHORTSTAT=1 file changed, 377 deletions(-)
Sistemas_Gestao/gestao-terapia/index.html | LOG=1296792 chore: initialize Plena Informatica repository | DIFF=D Sistemas_Gestao/gestao-terapia/index.html | SHORTSTAT=1 file changed, 4264 deletions(-)
Sistemas_Gestao/gestao-terapia/sw.js | LOG=1296792 chore: initialize Plena Informatica repository | DIFF=D Sistemas_Gestao/gestao-terapia/sw.js | SHORTSTAT=1 file changed, 25 deletions(-)
--- STATUS AFTER INVESTIGATION
 D Sistemas_Gestao/_design-system.md
 D Sistemas_Gestao/_device-classification.md
 ...
 D Sistemas_Gestao/gestao-terapia/sw.js
 D hero.mp4
 D logo-plena.png
 D servicos/hub-app/assets/index-DSj2oNcD.js
 D servicos/hub-app/assets/index-KILtb9Kn.css
 M servicos/hub-app/index.html
 M servicos/hub/index.html
 M servicos/hub/package-lock.json
 M servicos/hub/package.json
 M servicos/hub/src/App.tsx
 M servicos/hub/src/features/office/services/office-service.ts
 M servicos/hub/src/features/office/ui/OfficeAreaPage.test.tsx
 M servicos/hub/src/features/office/ui/OfficeAreaPage.tsx
 M servicos/hub/src/styles/app.css
?? .Agent/REGISTROS/2026-07-29-2244-codex-auditoria-f9-escritorio.md
?? graphify-out/
?? servicos/hub-app/assets/...
```

Padrao encontrado: todas as 180 delecoes de `Sistemas_Gestao` investigadas retornaram apenas o commit inicial `1296792` no log e `D` no diff contra `HEAD`. Nenhuma delas foi explicada por commit ja mesclado durante esta investigacao.

### Comando: investigacao de `hero.mp4` e `logo-plena.png`

```powershell
foreach ($p in @('hero.mp4','logo-plena.png')) {
  "--- PATH: $p"
  "git log --oneline -5 -- $p"; git log --oneline -5 -- $p
  "git diff --name-status HEAD -- $p"; git diff --name-status HEAD -- $p
  "git diff --shortstat HEAD -- $p"; git diff --shortstat HEAD -- $p
}
"--- STATUS AFTER ROOT ASSET INVESTIGATION"; git status --short
```

Output bruto:

```text
--- PATH: hero.mp4
git log --oneline -5 -- hero.mp4
77ef2d6 refactor: remocao completa do segmento de personalizados, integracao do video na hero e atualizacao do build de producao
git diff --name-status HEAD -- hero.mp4
D	hero.mp4
git diff --shortstat HEAD -- hero.mp4
 1 file changed, 0 insertions(+), 0 deletions(-)
--- PATH: logo-plena.png
git log --oneline -5 -- logo-plena.png
77ef2d6 refactor: remocao completa do segmento de personalizados, integracao do video na hero e atualizacao do build de producao
1296792 chore: initialize Plena Informatica repository
git diff --name-status HEAD -- logo-plena.png
D	logo-plena.png
git diff --shortstat HEAD -- logo-plena.png
 1 file changed, 0 insertions(+), 0 deletions(-)
--- STATUS AFTER ROOT ASSET INVESTIGATION
 D Sistemas_Gestao/_design-system.md
 ...
 D hero.mp4
 D logo-plena.png
 ...
```

### Checklist antes de qualquer commit

Restaurar ou decidir antes de commit:

- `Sistemas_Gestao/**` com acento no status: 180 delecoes suspeitas, nao relacionadas ao F9. Recomendacao tecnica: decisao humana antes de `git checkout --`, por causa da coexistencia/ambiguidade com `Sistemas_Gestao` sem acento que aparece limpa.
- `hero.mp4`: delecao suspeita fora do F9. Precisa de decisao humana; se nao for remocao intencional, restaurar.
- `logo-plena.png`: delecao suspeita fora do F9. Precisa de decisao humana; se nao for remocao intencional, restaurar.

Pode ser descartado se a intencao for nao versionar build local:

- `servicos/hub-app/assets/index-DSj2oNcD.js`
- `servicos/hub-app/assets/index-KILtb9Kn.css`
- novos assets em `servicos/hub-app/assets/*`
- `servicos/hub-app/index.html`

Precisa de decisao humana antes de decidir:

- `servicos/ROADMAP.md`
- `servicos/docs/DATA_MODEL.md`
- `servicos/hub/index.html`
- `servicos/hub/package.json`
- `servicos/hub/package-lock.json`
- `servicos/hub/src/styles/app.css`
- `servicos/hub/postcss.config.js`
- `servicos/hub/tailwind.config.js`
- `.Agent/REGISTROS/2026-07-29-2244-codex-auditoria-f9-escritorio.md`
- `.Agent/REGISTROS/2026-07-29-2315-antigravity-resolucao-pendencias-f9-escritorio.md`
- `graphify-out/`
- `servicos/hub/src/features/office/ui/sedK0ogzO`

Mudancas legitimamente relacionadas ao F9, mas ainda nao prontas para commit enquanto a tree estiver misturada:

- `servicos/hub/src/App.tsx`
- `servicos/hub/src/features/office/services/office-service.ts`
- `servicos/hub/src/features/office/ui/OfficeAreaPage.test.tsx`
- `servicos/hub/src/features/office/ui/OfficeAreaPage.tsx`
- `servicos/hub/src/features/office/ui/components/`
- `servicos/hub/src/features/office/ui/utils.ts`

## Tarefa 2 - AdminApp.test.tsx

### Comando: suite completa, rodada 1

```powershell
npm.cmd run test
```

Output bruto relevante:

```text
> plena-digital-hub@0.1.0 test
> vitest run

 RUN  v4.1.8 C:/Users/reina/OneDrive/Desktop/Projetos/Site Institucional Plena/servicos/hub

 ❯ src/features/tools/mei-das-guide/domain/das-values.test.ts (38 tests | 7 failed) 42ms
 ❯ src/app/institutional-integration.test.tsx (13 tests | 6 failed | 3 skipped) 866ms
 ❯ src/features/tools/mei-das-guide/ui/MeiDasGuideTool.test.tsx (19 tests | 1 failed) 3300ms

 Test Files  3 failed | 61 passed (64)
      Tests  14 failed | 483 passed | 3 skipped (500)
   Start at  23:08:01
   Duration  75.16s
```

Falhas brutas principais:

```text
FAIL src/app/institutional-integration.test.tsx > ... > mantem navegacao...
TestingLibraryElementError: Unable to find an accessible element with the role "banner" and name "Navegacao Plena"
<body>
  <div>
    <div class="p-8 text-center text-gray-500 font-medium animate-pulse">
      Carregando...
    </div>
  </div>
</body>

FAIL src/features/tools/mei-das-guide/domain/das-values.test.ts > getDasInfo > freight: sempre inclui INSS
AssertionError: expected 81.05 to be close to 194.52

FAIL src/features/tools/mei-das-guide/domain/das-values.test.ts > getDasInfo > commerce: sourceUrl aponta para Receita Federal
AssertionError: expected 'https://www.gov.br/empresas-e-negocios/...' to contain 'receita.fazenda.gov.br'

FAIL src/features/tools/mei-das-guide/ui/MeiDasGuideTool.test.tsx > MeiDasGuideTool > selecionar "Transporte autonomo de cargas" exibe aviso e valores corretos
AssertionError: expected 1 to be 2
```

Observacao: `src/admin/auth/AdminApp.test.tsx` nao apareceu como arquivo falho nesta rodada.

### Comando: suite completa, rodada 2

```powershell
npm.cmd run test
```

Output bruto relevante:

```text
> plena-digital-hub@0.1.0 test
> vitest run

 RUN  v4.1.8 C:/Users/reina/OneDrive/Desktop/Projetos/Site Institucional Plena/servicos/hub

 ❯ src/features/tools/mei-das-guide/domain/das-values.test.ts (38 tests | 7 failed) 41ms
 ❯ src/app/institutional-integration.test.tsx (13 tests | 6 failed | 3 skipped) 649ms
 ❯ src/features/tools/mei-das-guide/ui/MeiDasGuideTool.test.tsx (19 tests | 1 failed) 2753ms

 Test Files  3 failed | 61 passed (64)
      Tests  14 failed | 483 passed | 3 skipped (500)
   Start at  23:09:25
   Duration  43.44s
```

Conclusao: as falhas atuais sao deterministicas nas duas rodadas completas, mas nao incluem `AdminApp.test.tsx`. A falha antiga de `AdminApp` nao foi reproduzida no checkout atual.

### Comando: AdminApp isolado

```powershell
npm.cmd run test -- src/admin/auth/AdminApp.test.tsx
```

Output bruto:

```text
> plena-digital-hub@0.1.0 test
> vitest run src/admin/auth/AdminApp.test.tsx

 RUN  v4.1.8 C:/Users/reina/OneDrive/Desktop/Projetos/Site Institucional Plena/servicos/hub

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  23:10:26
   Duration  11.03s
```

### Comando: institucional + AdminApp

```powershell
npm.cmd run test -- src/app/institutional-integration.test.tsx src/admin/auth/AdminApp.test.tsx
```

Output bruto relevante:

```text
> plena-digital-hub@0.1.0 test
> vitest run src/app/institutional-integration.test.tsx src/admin/auth/AdminApp.test.tsx

 RUN  v4.1.8 C:/Users/reina/OneDrive/Desktop/Projetos/Site Institucional Plena/servicos/hub

 ❯ src/app/institutional-integration.test.tsx (13 tests | 6 failed | 3 skipped) 442ms

 Test Files  1 failed | 1 passed (2)
      Tests  6 failed | 8 passed | 3 skipped (17)
   Start at  23:10:26
   Duration  11.04s
```

Conclusao: `institutional-integration.test.tsx` falha, mas `AdminApp.test.tsx` passa no mesmo comando.

### Comando: auth/supabase subset + AdminApp

```powershell
npm.cmd run test -- src/admin/supabase-client.test.ts src/admin/auth/LoginPage.test.tsx src/admin/auth/AuthGuard.test.tsx src/admin/auth/AreaSelectionPage.test.tsx src/admin/auth/AdminApp.test.tsx
```

Output bruto:

```text
> plena-digital-hub@0.1.0 test
> vitest run src/admin/supabase-client.test.ts src/admin/auth/LoginPage.test.tsx src/admin/auth/AuthGuard.test.tsx src/admin/auth/AreaSelectionPage.test.tsx src/admin/auth/AdminApp.test.tsx

 RUN  v4.1.8 C:/Users/reina/OneDrive/Desktop/Projetos/Site Institucional Plena/servicos/hub

 Test Files  5 passed (5)
      Tests  19 passed (19)
   Start at  23:10:26
   Duration  11.06s
```

### Comando: office subset + AdminApp

```powershell
npm.cmd run test -- src/admin/auth/AdminApp.test.tsx src/features/office/services/office-service.test.ts src/features/office/ui/OfficeAreaPage.test.tsx
```

Output bruto:

```text
> plena-digital-hub@0.1.0 test
> vitest run src/admin/auth/AdminApp.test.tsx src/features/office/services/office-service.test.ts src/features/office/ui/OfficeAreaPage.test.tsx

 RUN  v4.1.8 C:/Users/reina/OneDrive/Desktop/Projetos/Site Institucional Plena/servicos/hub

 Test Files  3 passed (3)
      Tests  8 passed (8)
   Start at  23:11:01
   Duration  29.46s
```

### Comando: app subset + AdminApp

```powershell
npm.cmd run test -- src/app/tool-presentation.test.ts src/app/tool-registry.test.ts src/app/ToolCard.test.tsx src/app/ToolPageLayout.test.tsx src/app/institutional-integration.test.tsx src/admin/auth/AdminApp.test.tsx
```

Output bruto relevante:

```text
> plena-digital-hub@0.1.0 test
> vitest run src/app/tool-presentation.test.ts src/app/tool-registry.test.ts src/app/ToolCard.test.tsx src/app/ToolPageLayout.test.tsx src/app/institutional-integration.test.tsx src/admin/auth/AdminApp.test.tsx

 RUN  v4.1.8 C:/Users/reina/OneDrive/Desktop/Projetos/Site Institucional Plena/servicos/hub

 ❯ src/app/institutional-integration.test.tsx (13 tests | 6 failed | 3 skipped) 1197ms

 Test Files  1 failed | 5 passed (6)
      Tests  6 failed | 18 passed | 3 skipped (27)
   Start at  23:11:01
   Duration  26.38s
```

### Comando: proposals subset + AdminApp

```powershell
npm.cmd run test -- src/features/proposals/services/proposal-service.test.ts src/features/proposals/ui/AdminProposalsPage.test.tsx src/features/proposals/ui/ClientProposalPage.test.tsx src/admin/auth/AdminApp.test.tsx
```

Output bruto:

```text
> plena-digital-hub@0.1.0 test
> vitest run src/features/proposals/services/proposal-service.test.ts src/features/proposals/ui/AdminProposalsPage.test.tsx src/features/proposals/ui/ClientProposalPage.test.tsx src/admin/auth/AdminApp.test.tsx

 RUN  v4.1.8 C:/Users/reina/OneDrive/Desktop/Projetos/Site Institucional Plena/servicos/hub

 Test Files  4 passed (4)
      Tests  13 passed (13)
   Start at  23:11:01
   Duration  27.08s
```

### Comandos: ordem sequencial com `--fileParallelism=false`

```powershell
npm.cmd run test -- --fileParallelism=false src/app/institutional-integration.test.tsx src/admin/auth/AdminApp.test.tsx
npm.cmd run test -- --fileParallelism=false src/admin/auth/AdminApp.test.tsx src/app/institutional-integration.test.tsx
```

Output bruto relevante das duas ordens:

```text
Test Files  1 failed | 1 passed (2)
Tests  6 failed | 8 passed | 3 skipped (17)
```

Em ambas as ordens o arquivo falho foi `src/app/institutional-integration.test.tsx`; `AdminApp.test.tsx` passou.

### Inspecao de mocks/estado

Comando:

```powershell
rg -n "vi\.mock|useFakeTimers|localStorage|sessionStorage|mock.*supabase|createClient|getSession|signOut|resetAllMocks|clearAllMocks" src
```

Output bruto relevante:

```text
src/admin/auth/AdminApp.test.tsx:11:vi.mock('./AuthGuard', () => ({
src/admin/auth/AdminApp.test.tsx:15:vi.mock('../supabase-client', () => ({
src/admin/auth/AdminApp.test.tsx:97:vi.mock('../../features/office/ui/OfficeAreaPage', () => ({
src/admin/auth/AdminApp.test.tsx:101:vi.mock('../../features/proposals/ui/AdminProposalsPage', () => ({
src/admin/auth/AdminApp.test.tsx:113:    authMocks.signOut.mockReset()
src/admin/auth/LoginPage.test.tsx:12:vi.mock('../supabase-client', async () => {
src/admin/auth/AuthGuard.test.tsx:7:vi.mock('../supabase-client', () => ({
src/admin/supabase-client.test.ts:10:vi.mock('@supabase/supabase-js', () => ({
src/features/office/services/office-service.test.ts:5:vi.mock('../../../admin/supabase-client', () => ({
src/features/proposals/services/proposal-service.test.ts:5:vi.mock('../../../admin/supabase-client', () => ({
src/features/tools/mei-irpf-checklist/ui/MeiIrpfChecklistTool.test.tsx:12:    window.localStorage.clear()
src/features/tools/resume-builder/ui/ResumeBuilderTool.test.tsx:27:    window.localStorage.clear()
src/features/tools/declaration-builder/ui/DeclarationBuilderTool.test.tsx:8:    window.localStorage.clear()
```

Inspecao:

- `src/test/setup.ts` contem apenas `import '@testing-library/jest-dom/vitest'`; nao ha limpeza global de DOM/storage/mocks.
- Nao encontrei `vi.useFakeTimers`.
- `AdminApp.test.tsx` reseta seus mocks hoistados em `beforeEach` e limpa `window.location.hash` em `afterEach`.
- A falha atual de `institutional-integration.test.tsx` mostra o `Suspense` de `App.tsx` parado em fallback `Carregando...`. Esse arquivo usa asserts sincronos apos `render(<App />)` para rotas lazy.
- Isso explica as falhas atuais de `institutional-integration`, mas nao explica nem reproduz falha atual em `AdminApp`.

## Causa raiz e decisao de correcao

Causa raiz da falha antiga de `AdminApp.test.tsx`: nao reproduzida no checkout atual. A evidencia atual refuta a premissa de determinismo da falha em `AdminApp` hoje:

- suite completa 2x: `AdminApp.test.tsx` nao falhou;
- isolado: `4 passed`;
- com `office`: `3 files passed`, `8 tests passed`;
- com auth/supabase: `5 files passed`, `19 tests passed`;
- com app/institutional: `AdminApp` passou e o arquivo institucional falhou;
- com ordem sequencial invertida: `AdminApp` passou nas duas ordens.

Correcao aplicada: nenhuma. Aplicar `vi.clearAllMocks()`, reset global de modulos ou alteracao em `institutional-integration.test.tsx` seria uma mudanca sem causa raiz reproduzivel em `AdminApp` e poderia invadir tarefa 5.

## Status final de validacao

Suite completa segue vermelha, mas por falhas fora do `AdminApp`:

```text
Test Files  3 failed | 61 passed (64)
Tests  14 failed | 483 passed | 3 skipped (500)
```

Arquivos falhos:

- `src/app/institutional-integration.test.tsx`: 6 falhas por `Carregando...`/Suspense em assertions sincronas.
- `src/features/tools/mei-das-guide/domain/das-values.test.ts`: 7 falhas de valores/sourceUrl.
- `src/features/tools/mei-das-guide/ui/MeiDasGuideTool.test.tsx`: 1 falha de contagem de valor `194,52`.

Nenhuma alteracao de codigo foi aplicada nesta rodada alem deste registro.

