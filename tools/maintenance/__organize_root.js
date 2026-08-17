const fs = require('fs');
const path = require('path');

const root = process.cwd();
const imageNames = [
  'capaartigo.png',
  'heroadvocacia.png',
  'heroassistencia.png',
  'herobarbearia.png',
  'herobeleza.png',
  'heroecommerce.png',
  'herogastro.png',
  'herooferta.png',
  'heroprojconsult.png',
  'logoplena.svg',
  'officebiblioteca.png',
  'officeconferencia.png',
  'officediretoria.png',
  'officelounge.png',
  'officereuniao.png',
  'plena.jpg',
  'sociocecilia.png',
  'socioheitor.png',
  'sociorafael.png',
];

const textExts = new Set(['.html', '.css', '.js', '.md', '.xml', '.txt']);
const skipDirs = new Set(['.git', '.Agent', '.agents', '.claude', '.codex', '.superpowers', 'deploy', 'node_modules', 'tools']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(path.join(dir, entry.name), files);
      continue;
    }
    files.push(path.join(dir, entry.name));
  }
  return files;
}

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function relativeImagePath(fromFile, imageName) {
  const fromDir = path.dirname(fromFile);
  const target = path.join(root, 'assets', 'images', imageName);
  return toPosix(path.relative(fromDir, target));
}

function updateReferences() {
  let changed = 0;
  const files = walk(root).filter((file) => textExts.has(path.extname(file).toLowerCase()));
  for (const file of files) {
    let text = fs.readFileSync(file, 'utf8');
    const before = text;
    for (const imageName of imageNames) {
      const escaped = imageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const replacement = relativeImagePath(file, imageName);
      text = text.replace(new RegExp(`(?<![A-Za-z0-9_./-])(?:\\.\\./|\\.\\/|/)*${escaped}`, 'g'), replacement);
    }
    if (text !== before) {
      let written = false;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          fs.writeFileSync(file, text, 'utf8');
          written = true;
          break;
        } catch (error) {
          if (attempt === 4) throw error;
          Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250);
        }
      }
      if (!written) throw new Error(`Nao foi possivel atualizar ${file}`);
      changed += 1;
    }
  }
  console.log(JSON.stringify({ updatedReferenceFiles: changed }, null, 2));
}

function moveImages() {
  const targetDir = path.join(root, 'assets', 'images');
  fs.mkdirSync(targetDir, { recursive: true });
  const moved = [];
  for (const imageName of imageNames) {
    const source = path.join(root, imageName);
    const target = path.join(targetDir, imageName);
    if (fs.existsSync(source)) {
      fs.renameSync(source, target);
      moved.push(`assets/images/${imageName}`);
    }
  }
  console.log(JSON.stringify({ moved }, null, 2));
}

updateReferences();
moveImages();
