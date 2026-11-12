import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Seleção explícita: nunca copiar a raiz inteira ou o backup de produção.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const stage = path.join(root, 'deploy_staging/2026-11-12-public/site');
const reportPath = path.join(root, 'deploy_staging/2026-11-12-public/manifest.json');
const roots = ['assets/', 'produtos/', 'tecnologia/'];
const rootFiles = new Set(['index.html', 'style.css', 'script.js', '.htaccess', 'robots.txt', 'sitemap.xml', 'limpar-cache.html']);
const extensions = new Set(['.html', '.css', '.js', '.mjs', '.json', '.webmanifest', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.webm', '.pdf', '.txt', '.wasm']);
const forbidden = /(?:^|\/)(?:\.env[^/]*|\.git|node_modules|src|tests?|coverage|docs|backup|scratch_chrome_profile)(?:\/|$)|\.(?:map|sql|zip|bak|log|ts|tsx|md)$/i;
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
const publicFiles = tracked.filter(file => !forbidden.test(file) && (rootFiles.has(file) || (roots.some(prefix => file.startsWith(prefix)) && (extensions.has(path.extname(file).toLowerCase()) || path.basename(file) === '.htaccess'))));
for (const file of publicFiles) {
  const destination = path.resolve(stage, file);
  if (!destination.startsWith(stage + path.sep)) throw new Error('Caminho fora do staging.');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.isSymbolicLink()) throw new Error('Symlink não permitido no pacote.');
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
const files = walk(stage).sort();
const errors = [];
const redirects = new Set(['/tecnologia', '/tecnologia/', '/tecnologia/landing-pages/', '/tecnologia/landing-pages/index.html', '/tecnologia/ecommerce/', '/tecnologia/ecommerce/index.html', '/tecnologia/projetos-sob-consulta/', '/tecnologia/projetos-sob-consulta/index.html']);
function checkRef(file, raw) {
  if (!raw || /^(?:#|\/\/|[a-z][a-z\d+.-]*:|\$\{)/i.test(raw)) return;
  let reference;
  try { reference = decodeURIComponent(raw.split(/[?#]/)[0]); } catch { return; }
  if (!reference) return;
  const destination = reference.startsWith('/') ? path.join(stage, reference) : path.resolve(path.dirname(file), reference);
  const relative = '/' + path.relative(stage, destination).replaceAll('\\', '/');
  if (redirects.has(relative) || redirects.has(relative + '/')) return;
  if (!destination.startsWith(stage + path.sep) && destination !== stage) { errors.push({ file: path.relative(stage, file), ref: raw, reason: 'fora do pacote' }); return; }
  const exists = fs.existsSync(destination) && (fs.statSync(destination).isFile() || fs.existsSync(path.join(destination, 'index.html')));
  if (!exists) errors.push({ file: path.relative(stage, file).replaceAll('\\', '/'), ref: raw, reason: 'recurso ausente' });
}
const inventory = [];
for (const file of files) {
  const relative = path.relative(stage, file).replaceAll('\\', '/');
  if (forbidden.test(relative) || (!rootFiles.has(relative) && !roots.some(prefix => relative.startsWith(prefix)))) throw new Error('Arquivo fora da seleção pública: ' + relative);
  const data = fs.readFileSync(file);
  inventory.push({ path: relative, bytes: data.length, sha256: crypto.createHash('sha256').update(data).digest('hex') });
  if (!/\.(?:html|css|js|mjs|json|webmanifest)$/.test(file)) continue;
  const text = data.toString('utf8');
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bsb_secret_[A-Za-z0-9]+|\bsk-proj-[A-Za-z0-9]+/.test(text)) throw new Error('Possível segredo no arquivo público: ' + relative);
  for (const token of text.matchAll(/\beyJ[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+/g)) {
    try { if (JSON.parse(Buffer.from(token[1], 'base64url').toString()).role === 'service_role') throw new Error('Chave privilegiada no arquivo público: ' + relative); } catch (error) { if (error.message.startsWith('Chave privilegiada')) throw error; }
  }
  if (file.endsWith('.html')) for (const match of text.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) checkRef(file, match[1]);
  if (file.endsWith('.css')) for (const match of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) checkRef(file, match[1]);
  if (/\.(?:js|mjs)$/.test(file)) for (const match of text.matchAll(/(?:from\s*|import\s*\()\s*["'](\.[^"']+)["']/g)) checkRef(file, match[1]);
  if (file.endsWith('manifest.json') || file.endsWith('.webmanifest')) {
    const manifest = JSON.parse(text);
    for (const icon of manifest.icons || []) checkRef(file, icon.src);
    if (manifest.start_url) checkRef(file, manifest.start_url);
  }
  if (file.endsWith('/sw.js') || file.endsWith('\\sw.js')) {
    const cacheList = text.match(/(?:urlsToCache|ASSETS_TO_CACHE|PRECACHE_URLS)\s*=\s*\[([\s\S]*?)\]/);
    if (cacheList) for (const ref of cacheList[1].matchAll(/["']([^"']+)["']/g)) checkRef(file, ref[1]);
  }
}
const result = { commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), files: files.length, bytes: inventory.reduce((n, file) => n + file.bytes, 0), errors, inventory };
fs.writeFileSync(reportPath, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ stage, reportPath, files: result.files, bytes: result.bytes, errors }, null, 2));
if (errors.length) process.exitCode = 1;
