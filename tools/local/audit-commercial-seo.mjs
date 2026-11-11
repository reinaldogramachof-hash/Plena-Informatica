import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const domain = 'https://plenainformatica.com.br';
const staged = process.argv.includes('--staged');
const contents = new Map();
function readText(file) {
  const relative = path.relative(root, path.resolve(file)).replaceAll('\\', '/');
  if (!contents.has(relative)) contents.set(relative, staged ? execFileSync('git', ['show', `:${relative}`], { encoding:'utf8' }) : fs.readFileSync(file, 'utf8'));
  return contents.get(relative);
}
const urls = [...readText('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const failures = [];
const titles = new Set();
let navigationLinks = 0;
function fileFor(url) {
  let pathname = decodeURIComponent(new URL(url).pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  return path.join(root, pathname);
}
function check(condition, message) { if (!condition) failures.push(message); }
for (const url of urls) {
  const file = fileFor(url);
  check(fs.existsSync(file), `Página ausente: ${url}`);
  if (!fs.existsSync(file)) continue;
  const html = readText(file);
  const label = path.relative(root, file);
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1];
  check(title && !titles.has(title), `Título ausente ou repetido: ${label}`);
  titles.add(title);
  check((html.match(/<h1\b/gi) || []).length === 1, `H1 ausente ou repetido: ${label}`);
  check(html.includes(`rel="canonical" href="${url}"`), `Canonical inconsistente: ${label}`);
  check(!/<meta\s+name="robots"[^>]*noindex/i.test(html), `Página comercial noindex: ${label}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  check(new Set(ids).size === ids.length, `IDs duplicados: ${label}`);
  for (const key of ['description', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    check(new RegExp(`<meta name="${key}"\\s+content="[^"]+"`).test(html), `Meta ${key} ausente: ${label}`);
  }
  check(html.includes(`property="og:url" content="${url}"`), `OG URL inconsistente: ${label}`);
  const socialImage = (html.match(/property="og:image" content="([^"]+)"/) || [])[1];
  check(socialImage && fs.existsSync(fileFor(socialImage)), `Imagem social ausente: ${label}`);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  check(ld.length > 0, `Dados estruturados ausentes: ${label}`);
  for (const [, json] of ld) { try { JSON.parse(json); } catch { failures.push(`JSON-LD inválido: ${label}`); } }
  for (const tag of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*data-plena-kind="(?:segment|service|model)"[^>]*>/g)) {
    navigationLinks++;
    const destination = new URL(tag[1], url);
    if (destination.origin !== domain) continue;
    const targetFile = fileFor(destination.href);
    check(fs.existsSync(targetFile), `Destino comercial ausente: ${label} → ${tag[1]}`);
    if (destination.hash && fs.existsSync(targetFile)) {
      check(readText(targetFile).includes(`id="${decodeURIComponent(destination.hash.slice(1))}"`), `Âncora ausente: ${label} → ${tag[1]}`);
    }
  }
}
for (const slug of ['assistencia-pro','barbearia-premium','beleza-spa','gestao-terapia','gestao-odonto','gestao-fit','gestao-gastro','gestao-lavarapido','gestao-sorveteria','gestao-pdv','gestao-salas']) {
  for (const file of ['index.html','tecnologia/tecnologia.html']) check(readText(file).includes(`produtos/${slug}.html`), `Segmento não alcançável: ${file} → ${slug}`);
}
console.log(JSON.stringify({ commercialPages:urls.length, navigationLinks, failures }, null, 2));
if (failures.length) process.exitCode = 1;
