const fs = require('fs');
const path = require('path');

const root = process.argv[3] ? path.resolve(process.argv[3]) : process.cwd();
const mode = process.argv[2] || 'audit';
const textExts = new Set(['.html', '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.svg', '.webmanifest']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function isTextFile(file) {
  return textExts.has(path.extname(file).toLowerCase());
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function normalizePhones() {
  const replacements = [
    [/551299291018/g, '5512992191018'],
    [/\+551299291018/g, '+5512992191018'],
    [/\(12\)\s*9929-1018/g, '(12) 99219-1018'],
    [/\(12\)\s*99291-018/g, '(12) 99219-1018'],
    [/12[\s-]*99291018/g, '12 99219-1018'],
    [/12[\s-]*99291-018/g, '12 99219-1018'],
    [/9929-1018/g, '99219-1018'],
    [/99291-018/g, '99219-1018'],
  ];

  let changed = 0;
  for (const file of walk(root).filter(isTextFile)) {
    const before = fs.readFileSync(file, 'utf8');
    let after = before;
    for (const [pattern, value] of replacements) after = after.replace(pattern, value);
    if (after !== before) {
      fs.writeFileSync(file, after, 'utf8');
      changed += 1;
    }
  }
  console.log(JSON.stringify({ mode: 'normalizePhones', changed }, null, 2));
}

function auditMojibake() {
  const patterns = [
    ['a-agudo', /\u00c3\u00a1/g],
    ['e-agudo', /\u00c3\u00a9/g],
    ['a-til', /\u00c3\u00a3/g],
    ['c-cedilha', /\u00c3\u00a7/g],
    ['o-agudo', /\u00c3\u00b3/g],
    ['i-agudo', /\u00c3\u00ad/g],
    ['u-agudo', /\u00c3\u00ba/g],
    ['e-circ', /\u00c3\u00aa/g],
    ['o-til', /\u00c3\u00b5/g],
    ['aspas-travessao', /\u00e2[\u20ac\u0080-\u009f]/g],
    ['replacement-char', /\ufffd/g],
    ['html-atilde-acirc', /&Atilde;|&Acirc;/g],
  ];
  const hits = [];
  for (const file of walk(root).filter(isTextFile)) {
    const text = fs.readFileSync(file, 'utf8');
    for (const [name, pattern] of patterns) {
      pattern.lastIndex = 0;
      const matches = text.match(pattern);
      if (matches) hits.push({ file: rel(file), pattern: name, count: matches.length });
    }
  }
  console.log(JSON.stringify({ mode: 'auditMojibake', hits }, null, 2));
  if (hits.length) process.exitCode = 2;
}

function resolvePublicRef(fromFile, raw) {
  if (!raw || /^\$\{/.test(raw) || /^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(raw)) return null;
  const clean = raw.split('#')[0].split('?')[0];
  if (!clean || clean.startsWith('//')) return null;
  if (clean.startsWith('/')) return path.resolve(root, `.${decodeURIComponent(clean)}`);
  return path.resolve(path.dirname(fromFile), decodeURIComponent(clean));
}

function existsPublicTarget(target) {
  if (!target) return true;
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return true;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) return fs.existsSync(path.join(target, 'index.html'));
  if (fs.existsSync(`${target}.html`)) return true;
  return false;
}

function auditLinks() {
  const broken = [];
  const htmlFiles = walk(root).filter((file) => path.extname(file).toLowerCase() === '.html');
  for (const file of htmlFiles) {
    const text = fs.readFileSync(file, 'utf8');
    const attrRe = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;
    let match;
    while ((match = attrRe.exec(text))) {
      const target = resolvePublicRef(file, match[1]);
      if (target && !existsPublicTarget(target)) broken.push({ from: rel(file), ref: match[1] });
    }
  }

  const tech = path.join(root, 'tecnologia', 'tecnologia.html');
  if (fs.existsSync(tech)) {
    const text = fs.readFileSync(tech, 'utf8');
    const demoRe = /openDemoModal\(\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = demoRe.exec(text))) {
      const target = resolvePublicRef(tech, match[1]);
      if (target && !existsPublicTarget(target)) broken.push({ from: rel(tech), ref: match[1], source: 'openDemoModal' });
    }
  }

  console.log(JSON.stringify({ mode: 'auditLinks', broken }, null, 2));
  if (broken.length) process.exitCode = 3;
}

if (mode === 'normalize-phones') normalizePhones();
else if (mode === 'mojibake') auditMojibake();
else if (mode === 'links') auditLinks();
else if (mode === 'clean-builds') {
  const pairs = [
    ['servicos/hub-app/index.html', 'servicos/hub-app/assets'],
    ['tecnologia/demos/gestao-restaurantes/index.html', 'tecnologia/demos/gestao-restaurantes/assets'],
  ];
  const assetNameRe = /[A-Za-z0-9_.-]+\.(?:js|css|png|svg|ttf|woff2?)/g;

  for (const [htmlRel, assetsRel] of pairs) {
    const html = path.join(root, htmlRel);
    const assetsDir = path.join(root, assetsRel);
    if (!fs.existsSync(html) || !fs.existsSync(assetsDir)) continue;

    const keep = new Set();
    const addMatches = (text) => {
      for (const match of text.matchAll(assetNameRe)) keep.add(path.basename(match[0]));
    };
    addMatches(fs.readFileSync(html, 'utf8'));

    for (const file of [...keep]) {
      const full = path.join(assetsDir, file);
      if (fs.existsSync(full) && path.extname(file).toLowerCase() === '.js') {
        addMatches(fs.readFileSync(full, 'utf8'));
      }
    }

    let removed = 0;
    for (const file of fs.readdirSync(assetsDir)) {
      const full = path.join(assetsDir, file);
      if (fs.statSync(full).isFile() && !keep.has(file)) {
        fs.unlinkSync(full);
        removed += 1;
      }
    }
    console.log(JSON.stringify({ mode: 'cleanBuilds', html: htmlRel, kept: keep.size, removed }, null, 2));
  }
}
else {
  normalizePhones();
  auditMojibake();
  auditLinks();
}
