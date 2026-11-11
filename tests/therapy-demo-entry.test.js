const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loader() {
  const element = () => ({ classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} }, addEventListener() {} });
  const elements = Object.fromEntries(['demo-modal', 'demo-frame', 'demo-direct-link', 'product-mobile-menu'].map(id => [id, element()]));
  const context = vm.createContext({
    document: { body: { dataset: { demoUrl: '../tecnologia/demos/gestao-terapia/index.html', demoFullscreen: 'true' }, style: {} }, documentElement: { style: {} }, baseURI: 'http://localhost/produtos/gestao-terapia.html', getElementById: id => elements[id], addEventListener() {} },
    window: { location: { href: 'http://localhost/produtos/gestao-terapia.html' }, matchMedia: () => ({ matches: false }), setTimeout: () => 1, clearTimeout() {} },
    URL, Date,
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../produtos/assets/produtos.js'), 'utf8'), context);
  return { open: context.window.openDemoModal, frame: elements['demo-frame'] };
}

test('a abertura padrão das páginas de produto continua sem rota específica', () => {
  const { open, frame } = loader(); open();
  assert.equal(new URL(frame.src, 'http://localhost/produtos/').pathname, '/tecnologia/demos/gestao-terapia/index.html');
  assert.equal(new URL(frame.src, 'http://localhost/produtos/').searchParams.has('view'), false);
});

test('o carregador transmite a tela solicitada para a demo', () => {
  const { open, frame } = loader(); open({ view: 'schedule' });
  assert.equal(new URL(frame.src, 'http://localhost/produtos/').searchParams.get('view'), 'schedule');
});

test('a entrada da demo abre apenas destinos conhecidos e o paciente da captura', () => {
  const entry = require('../tecnologia/demos/gestao-terapia/assets/js/demo-entry.js');
  const calls = [];
  const api = { navigate(view) { calls.push(view); }, openPatient(id) { calls.push(id); } };
  assert.equal(entry.open('?view=patients', api), true);
  assert.deepEqual(calls, ['patients', 'demo_patient_13']);
  assert.equal(entry.open('?view=financial', api), true);
  assert.equal(calls.at(-1), 'financial');
  assert.equal(entry.open('?view=schedule', api), true);
  assert.equal(calls.at(-1), 'schedule');
  const before = calls.length;
  assert.equal(entry.open('?view=settings', api), false);
  assert.equal(entry.open('', api), false);
  assert.equal(calls.length, before);
});
