const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { resolveOrigin, returnTarget, destinationHref } = require('../assets/catalog-navigation.js');
const base = 'https://plenainformatica.com.br';

test('modelos retornam à categoria de Tecnologia quando acessados diretamente', () => {
  for (const [pathname, hash] of [
    ['/tecnologia/sites-premium/advocacia/index.html', '#sites-premium'],
    ['/tecnologia/landing-pages/lp-01-lancamento.html', '#landing-pages'],
    ['/tecnologia/modelos/landing-pages/captura-leads/', '#landing-pages'],
    ['/tecnologia/demos/ecommerce/demo-moda.html', '#ecommerce'],
    ['/produtos/gestao-terapia.html', '#sistemas'],
  ]) {
    assert.equal(returnTarget({ url: base + pathname }).href, '/tecnologia/tecnologia.html' + hash);
  }
});

test('origem da home é preservada pelo catálogo, modelo e recarregamento', () => {
  const catalog = base + '/tecnologia/tecnologia.html?origem=inicio#sites-premium';
  const model = destinationHref('sites-premium/advocacia/index.html', catalog);
  assert.equal(new URL(model, base).searchParams.get('origem'), 'inicio');
  assert.equal(returnTarget({ url: new URL(model, base).href }).href, '/index.html#services');
  assert.equal(returnTarget({ url: catalog }).href, '/index.html#services');
});

test('reconhece home por referrer interno e ignora origem externa ou inválida', () => {
  const url = base + '/produtos/gestao-terapia.html';
  assert.equal(resolveOrigin({ url, referrer: base + '/' }), 'inicio');
  assert.equal(resolveOrigin({ url, referrer: 'https://outro.example/index.html' }), 'tecnologia');
  assert.equal(resolveOrigin({ url: url + '?origem=https://outro.example/' }), 'tecnologia');
  assert.equal(returnTarget({ url: url + '?origem=//outro.example' }).href, '/tecnologia/tecnologia.html#sistemas');
});

test('origem explícita de Tecnologia prevalece sobre referrer antigo da home', () => {
  assert.equal(resolveOrigin({ url: base + '/tecnologia/sites-premium/advocacia/?origem=tecnologia', referrer: base + '/' }), 'tecnologia');
});

test('não altera links externos, âncoras, contatos, downloads ou demos de sistemas', () => {
  const current = base + '/tecnologia/tecnologia.html?origem=inicio';
  for (const href of ['https://outro.example/', '//outro.example/tecnologia/sites-premium/', '#contato', 'mailto:contato@example.com', 'demos/gestao-terapia/', '../arquivo.pdf']) {
    assert.equal(destinationHref(href, current), href);
  }
});

test('preserva parâmetros e fragmentos e a home inicia um novo percurso', () => {
  const href = destinationHref('tecnologia/tecnologia.html?utm_source=site#ecommerce', base + '/?origem=tecnologia');
  const target = new URL(href, base);
  assert.equal(target.searchParams.get('origem'), 'inicio');
  assert.equal(target.searchParams.get('utm_source'), 'site');
  assert.equal(target.hash, '#ecommerce');
});

test('todos os modelos do catálogo têm retorno estático e assets locais válidos', () => {
  const catalogFile = path.resolve(__dirname, '../tecnologia/tecnologia.html');
  const catalog = fs.readFileSync(catalogFile, 'utf8');
  const refs = [...catalog.matchAll(/href="((?:sites-premium\/[^/]+\/index\.html|modelos\/landing-pages\/[^/]+\/index\.html|landing-pages\/lp-[^"]+|demos\/ecommerce\/[^"]+))"/g)];
  assert.equal(refs.length, 28);
  for (const [, ref] of refs) {
    const file = path.resolve(path.dirname(catalogFile), ref);
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /data-plena-return href="[^"]*tecnologia\.html#(?:sites-premium|landing-pages|ecommerce)"/);
    assert.doesNotMatch(html, /class="plena-return"/);
    assert.doesNotMatch(html, /Voltar ao portal/);
    for (const match of html.matchAll(/(?:src|href)="([^"]*catalog-navigation\.(?:js|css))"/g)) {
      assert.ok(fs.existsSync(path.resolve(path.dirname(file), match[1])), match[1]);
    }
    assert.match(html, /catalog-navigation\.js/);
    assert.match(html, /catalog-navigation\.css/);
  }
});

test('portal premium é aposentado e os aliases antigos levam às categorias do catálogo', () => {
  const portal = fs.readFileSync(path.resolve(__dirname, '../tecnologia/sites-premium/index.html'), 'utf8');
  assert.match(portal, /http-equiv="refresh"[^>]*tecnologia\.html#sites-premium/);
  assert.doesNotMatch(portal, /class="portal-grid"/);
  const htaccess = fs.readFileSync(path.resolve(__dirname, '../.htaccess'), 'utf8');
  for (const category of ['sites-premium', 'landing-pages', 'ecommerce']) {
    assert.ok(htaccess.split('\n').some(line => line.startsWith('RedirectMatch 301') && line.includes(`tecnologia/${category}`) && line.endsWith(`tecnologia.html#${category}`)));
  }
  const sitemap = fs.readFileSync(path.resolve(__dirname, '../sitemap.xml'), 'utf8');
  assert.ok(!sitemap.includes('<loc>' + base + '/tecnologia/sites-premium/</loc>'));
});

test('redirecionamento local do portal preserva somente origens reconhecidas', () => {
  const vm = require('node:vm');
  const html = fs.readFileSync(path.resolve(__dirname, '../tecnologia/sites-premium/index.html'), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [search, query] of [['?origem=inicio', '?origem=inicio'], ['?origem=tecnologia', '?origem=tecnologia'], ['?origem=https://outro.example', ''], ['', '']]) {
    let destination;
    vm.runInNewContext(script, { URLSearchParams, location: { search, replace(url) { destination = url; } } });
    assert.equal(destination, '../tecnologia.html' + query + '#sites-premium');
  }
});

test('retorno do menu nativo usa texto curto sem recriar botão flutuante', () => {
  const vm = require('node:vm');
  for (const [origin, label, href] of [['inicio', 'Página inicial', '/index.html#services'], ['tecnologia', 'Tecnologia', '/tecnologia/tecnologia.html#sistemas']]) {
    const attrs = { 'data-plena-return': 'compact', href: '../tecnologia/tecnologia.html' };
    const link = { hasAttribute(name) { return name in attrs; }, getAttribute(name) { return attrs[name]; }, setAttribute(name, value) { attrs[name] = value; } };
    const document = { referrer: '', querySelectorAll() { return [link]; }, addEventListener() {} };
    vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../assets/catalog-navigation.js'), 'utf8'), { URL, window: { document, location: { href: base + '/produtos/gestao-terapia.html?origem=' + origin } } });
    assert.equal(link.textContent, label);
    assert.equal(attrs.href, href);
  }
});

test('home oferece atalhos diretos para as categorias de modelos', () => {
  const home = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
  for (const hash of ['sites-premium', 'landing-pages', 'ecommerce']) {
    assert.ok(home.includes(`tecnologia/tecnologia.html?origem=inicio#${hash}`));
  }
});

test('abas restauram a categoria pelo hash e acompanham alterações na mesma página', () => {
  const vm = require('node:vm');
  const source = fs.readFileSync(path.resolve(__dirname, '../tecnologia/script.js'), 'utf8');
  const block = source.slice(source.indexOf('// Abas do catálogo'), source.indexOf('const desktopQuery'));
  const ids = ['tab-gestão', 'tab-premium', 'tab-landing', 'tab-ecom', 'tab-automacao', 'tab-sites'];
  const element = id => ({ id, attrs: {}, dataset: { target: id }, hidden: true, classList: { add() {}, remove() {} },
    setAttribute(k, v) { this.attrs[k] = v; }, removeAttribute(k) { delete this.attrs[k]; }, addEventListener() {}, scrollIntoView() {} });
  const buttons = ids.map(element);
  const panels = ids.map(element);
  const listeners = {};
  const location = new URL(base + '/tecnologia/tecnologia.html?origem=inicio#sites-premium');
  const window = { location, addEventListener(name, fn) { listeners[name] = fn; },
    history: { replaceState(state, title, url) { location.href = new URL(url, location).href; } } };
  const context = vm.createContext({ window, history: window.history, REDUCED_MOTION: true, trackIntent() {}, showNicheRow() {},
    document: { querySelectorAll(q) { return q === '.tab-pane' ? panels : buttons; },
      querySelector(q) { return buttons.find(btn => q.includes(`"${btn.id}"`)) || { addEventListener() {} }; },
      getElementById(id) { return panels.find(panel => panel.id === id) || element(id); } } });
  vm.runInContext(block, context);
  assert.equal(panels[1].hidden, false);
  context.activateTabByTarget('tab-ecom');
  assert.equal(window.location.hash, '#ecommerce');
  assert.equal(window.location.search, '?origem=inicio');
  window.location.hash = '#landing-pages';
  listeners.hashchange();
  assert.equal(panels[2].hidden, false);
  assert.equal(panels[3].hidden, true);
});
