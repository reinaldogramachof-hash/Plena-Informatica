const fs = require('fs');
const path = require('path');

const root = process.cwd();
const roots = ['index.html', 'limpar-cache.html', 'blog', 'produtos', 'servicos', 'tecnologia', 'README.md'];
const textExts = new Set(['.html', '.css', '.js', '.md', '.xml', '.txt']);
const skipSegments = new Set(['hub-app/assets']);
const skipDirNames = new Set(['hub', 'node_modules', 'assets']);
const badPattern = /Ã¡|Ã©|Ã£|Ã§|Ã³|Ã­|Ãº|Ãª|Ãµ|Ã¢|Ã´|Ã‡|Ã‰|Ã|Ã“|Ã|Ãš|Ãƒ|â€”|â€“|â€œ|â€|â€˜|â€™|Â/g;

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
    if (entry.isDirectory() && skipDirNames.has(entry.name)) continue;
    const child = path.join(rel, entry.name);
    if (entry.isDirectory()) walk(child, files);
    else files.push(path.join(root, child));
  }
  return files;
}

function score(text) {
  return (text.match(badPattern) || []).length;
}

const changed = [];

for (const file of roots.flatMap((item) => walk(item))) {
  const rel = normalize(file);
  if ([...skipSegments].some((segment) => rel.includes(segment))) continue;
  if (!textExts.has(path.extname(file).toLowerCase())) continue;

  if (fs.statSync(file).size > 2 * 1024 * 1024) continue;
  const before = fs.readFileSync(file, 'utf8');
  const beforeScore = score(before);
  if (!beforeScore) continue;

  const repaired = Buffer.from(before, 'latin1').toString('utf8');
  const afterScore = score(repaired);
  if (afterScore < beforeScore) {
    fs.writeFileSync(file, repaired, 'utf8');
    changed.push({ file: rel, beforeScore, afterScore });
  }
}

console.log(JSON.stringify({ changed }, null, 2));
