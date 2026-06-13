# Handoff — Integração Sistema de Gestão Restaurantes (Plena Gestão Gastro)
**Para:** Agente Antigravity (IDE de desenvolvimento)
**Data:** 2026-06-13
**Sessão:** Claude / Cowork

---

## Contexto

O sistema correto é **Sistema de Gestão Restaurantes** (pasta `Sistema de Gestão Restaurantes/`), não o "Gestão Gastro" anterior. As etapas 1–3 abaixo foram concluídas pelo Claude no Cowork. A **Etapa 4** — atualizar `plena-deploy-2026.zip` — é de responsabilidade do Antigravity.

---

## Arquivos criados / modificados

### 1. `Sistema de Gestão Restaurantes/src/App.tsx` ← MODIFICADO
Adicionado bypass de autenticação Supabase no início de `AuthGate` (linhas ~200–212). Em produção, `VITE_DEMO_MODE` não é definida, então o bloco é ignorado pelo tree-shaking:

```tsx
const AuthGate: React.FC = () => {
  // MODO DEMO: bypass de autenticação para acesso público na página de tecnologia da Plena.
  // Em produção, VITE_DEMO_MODE não é definida — este bloco é removido pelo tree-shaking do Vite.
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    return (
      <AppBaseProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AppBaseProvider>
    );
  }
  // ... código Supabase original continua abaixo
```

**Comportamento demo:** `AppBaseProvider` sem `authUser`/`authEmpresa` usa os fallbacks internos:
- Empresa: `Gestão Gastro Demo` · plano `gestao` (todos os módulos)
- Usuário: `Administrador Demo` · role `master`

### 2. `Sistema de Gestão Restaurantes/vite.demo.config.ts` ← ARQUIVO NOVO
Config dedicada para build de demo. **Não altera o build de produção.**

Uso:
```bash
npx vite build --config vite.demo.config.ts
# Output: dist-demo/
```

Principais diferenças do config de produção:
- `base: '/tecnologia/demos/gestao-restaurantes/'`
- `outDir: 'dist-demo'`
- `define: { 'import.meta.env.VITE_DEMO_MODE': '"true"' }`
- Variáveis de Supabase lidas do `.env` existente (cliente é criado mas nunca chamado no demo)

### 3. `Site Institucional Plena/tecnologia/demos/gestao-restaurantes/` ← PASTA NOVA
Conteúdo do `dist-demo/` copiado aqui. Estrutura:
```
gestao-restaurantes/
  index.html              ← entry point React com base path correto
  favicon.png
  pwa-512x512.png
  registerSW.js
  manifest.webmanifest
  assets/
    index-*.js            ← bundle principal
    vendor-react-*.js
    vendor-supabase-*.js
    vendor-motion-*.js
    [demais chunks lazy]
```

### 4. `Site Institucional Plena/tecnologia/tecnologia.html` ← MODIFICADO
Card do Gestão Gastro atualizado:
- Badge: `"Em implantação · Agendamento"` → `"Novo · Demo disponível"`
- `data-offer="gestão-gastro"` (com acento) → `data-offer="gestao-gastro"`
- Descrição atualizada para mencionar delivery e inteligência
- Preço: `R$ 147/mês` → `R$ 89/mês` (reflete plano Essencial)
- Adicionado botão **"Ver demo"** com `onclick="openDemoModal('demos/gestao-restaurantes/index.html', 'gestao-gastro')"`
- Link "Conhecer página" agora dentro de `<div class="flex flex-wrap gap-3 mt-2">` junto com o botão demo

### 5. `Site Institucional Plena/produtos/gestao-gastro.html` ← REESCRITO
Página completamente reescrita com:
- Hero com mockup animado (mapa de mesas + KPIs em CSS puro)
- 20 módulos listados com ícones Phosphor
- **3 planos com preços reais**: Essencial R$89 / Profissional R$189 / Gestão R$329
- 6 perguntas no FAQ via `<details>` acessíveis
- CTA final duplo: "Abrir demo grátis" + "Agendar demonstração"
- **Modal inline** (`#demo-modal`) que carrega `../tecnologia/demos/gestao-restaurantes/index.html` em iframe
- Correção do link do logo: `../tecnologia.html` → `../tecnologia/tecnologia.html`

---

## Etapa 4 — O que o Antigravity deve fazer

### Objetivo
Atualizar `plena-deploy-2026.zip` (na raiz de `Site Institucional Plena/`) para incluir os novos arquivos.

### Arquivos a adicionar/atualizar no zip

| Caminho no zip | Origem local |
|---|---|
| `tecnologia/demos/gestao-restaurantes/index.html` | `tecnologia/demos/gestao-restaurantes/index.html` |
| `tecnologia/demos/gestao-restaurantes/assets/*` | `tecnologia/demos/gestao-restaurantes/assets/` |
| `tecnologia/demos/gestao-restaurantes/favicon.png` | idem |
| `tecnologia/demos/gestao-restaurantes/pwa-512x512.png` | idem |
| `tecnologia/demos/gestao-restaurantes/registerSW.js` | idem |
| `tecnologia/demos/gestao-restaurantes/manifest.webmanifest` | idem |
| `tecnologia/tecnologia.html` | `tecnologia/tecnologia.html` |
| `produtos/gestao-gastro.html` | `produtos/gestao-gastro.html` |

### Restrições importantes
- **NÃO incluir** `servicos/imagens/` e `personalizados/imagens/` — já estão no servidor
- Manter mesma estrutura de pastas do zip anterior (3.8 MB, 121 arquivos base)

### Script Python sugerido (adicionar ao zip existente)
```python
import zipfile, os

ZIP_PATH = 'plena-deploy-2026.zip'
BASE = 'Site Institucional Plena'  # ajustar caminho conforme contexto do Antigravity

# Arquivos HTML atualizados
html_files = [
    'tecnologia/tecnologia.html',
    'produtos/gestao-gastro.html',
]

# Assets da demo
demo_dir = os.path.join(BASE, 'tecnologia/demos/gestao-restaurantes')
demo_files = []
for root, _, files in os.walk(demo_dir):
    for fname in files:
        abs_path = os.path.join(root, fname)
        rel_path = os.path.relpath(abs_path, BASE).replace('\\', '/')
        demo_files.append((abs_path, rel_path))

with zipfile.ZipFile(ZIP_PATH, 'a', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
    for rel in html_files:
        abs_path = os.path.join(BASE, rel)
        if os.path.isfile(abs_path):
            zf.write(abs_path, rel)
            print(f'  + {rel}')
    for abs_path, rel_path in demo_files:
        zf.write(abs_path, rel_path)
        print(f'  + {rel_path}')

print('Done.')
```

---

## Checklist de verificação pós-deploy (para Reinaldo)

- [ ] `/tecnologia/demos/gestao-restaurantes/index.html` acessível no servidor
- [ ] Assets carregam com caminho `/tecnologia/demos/gestao-restaurantes/assets/...`
- [ ] Sistema abre sem tela de login (demo mode ativo)
- [ ] Card em `/tecnologia/tecnologia.html` exibe botão "Ver demo" e modal abre corretamente
- [ ] Página `/produtos/gestao-gastro.html` exibe 3 planos com preços e modal de demo funciona
- [ ] Modal fecha com Escape e clique fora do iframe
- [ ] Permissões de arquivo: `644` para arquivos, `755` para diretórios

---

**Gerado por Claude / Cowork em 2026-06-13**
