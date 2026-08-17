const fs = require('fs');
const path = require('path');

const root = process.cwd();
const publicRoots = ['index.html', 'limpar-cache.html', 'blog', 'produtos', 'servicos', 'tecnologia', 'Sistemas_Gestao'];
const textExts = new Set(['.html', '.css', '.js', '.xml']);
const imageNames = [
  'logoplena.svg',
  'plena.jpg',
  'capaartigo.png',
  'heroadvocacia.png',
  'heroassistencia.png',
  'herobarbearia.png',
  'herobeleza.png',
  'heroecommerce.png',
  'herogastro.png',
  'herooferta.png',
  'heroprojconsult.png',
  'officebiblioteca.png',
  'officeconferencia.png',
  'officediretoria.png',
  'officelounge.png',
  'officereuniao.png',
  'sociocecilia.png',
  'socioheitor.png',
  'sociorafael.png',
];

function normalize(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function walk(rel, files = []) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return files;

  const info = fs.statSync(full);
  if (info.isFile()) {
    files.push(full);
    return files;
  }

  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.name === 'hub') continue;
    const child = path.join(rel, entry.name);
    if (entry.isDirectory()) walk(child, files);
    else files.push(path.join(root, child));
  }
  return files;
}

function resolveRef(fromFile, raw) {
  if (!raw || raw.startsWith('${')) return null;
  if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(raw) || raw.startsWith('//')) return null;
  const clean = raw.split('#')[0].split('?')[0];
  if (!clean) return null;
  if (clean.startsWith('/')) return path.join(root, clean);
  return path.resolve(path.dirname(fromFile), decodeURIComponent(clean));
}

function targetExists(target) {
  if (!target) return true;
  if (fs.existsSync(target)) {
    const info = fs.statSync(target);
    return info.isDirectory() ? fs.existsSync(path.join(target, 'index.html')) : true;
  }
  return fs.existsSync(`${target}.html`);
}

const files = publicRoots.flatMap((item) => walk(item)).filter((file) => textExts.has(path.extname(file).toLowerCase()));
const badRootImageRefs = [];
const missingRefs = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');

  for (const imageName of imageNames) {
    let index = -1;
    while ((index = text.indexOf(imageName, index + 1)) >= 0) {
      const before = text.slice(Math.max(0, index - 120), index);
      if (!before.includes('assets/images/')) badRootImageRefs.push(`${normalize(file)} -> ${imageName}`);
    }
  }

  if (['.html', '.css', '.xml'].includes(path.extname(file).toLowerCase())) {
    const attrRe = /\b(?:href|src)=["']([^"']+)["']/g;
    let match;
    while ((match = attrRe.exec(text))) {
      const target = resolveRef(file, match[1]);
      if (target && !targetExists(target)) missingRefs.push(`${normalize(file)} -> ${match[1]}`);
    }
  }
}

const result = {
  files: files.length,
  badRootImageRefs: [...new Set(badRootImageRefs)],
  missingRefs: [...new Set(missingRefs)],
};

console.log(JSON.stringify(result, null, 2));
if (result.badRootImageRefs.length || result.missingRefs.length) process.exitCode = 2;
