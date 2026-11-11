const assert = require('node:assert/strict');
const test = require('node:test');

const {
  VALID_VIEWS,
  normalizeRequestedView,
  readRequestedView,
  findNavButton,
  applyInitialRoute,
} = require('../tecnologia/demos/gestao-restaurantes/js/demo-entry.js');

test('Gestão Gastro demo contextual entry resolves aliases and routes cleanly', () => {
  assert.ok(VALID_VIEWS.includes('mesas'));
  assert.ok(VALID_VIEWS.includes('cozinha'));
  assert.ok(VALID_VIEWS.includes('pdv'));
  assert.ok(VALID_VIEWS.includes('estoque'));
  assert.ok(VALID_VIEWS.includes('dashboard'));

  assert.equal(normalizeRequestedView('mesas'), 'mesas');
  assert.equal(normalizeRequestedView('salao'), 'mesas');
  assert.equal(normalizeRequestedView('kds'), 'cozinha');
  assert.equal(normalizeRequestedView('kitchen'), 'cozinha');
  assert.equal(normalizeRequestedView('balcao'), 'pdv');
  assert.equal(normalizeRequestedView('stock'), 'estoque');
  assert.equal(normalizeRequestedView('desconhecido'), null);

  assert.equal(readRequestedView('?view=cozinha'), 'cozinha');
  assert.equal(readRequestedView('?view=Mesas'), 'mesas');
  assert.equal(readRequestedView('?view=pdv'), 'pdv');
  assert.equal(readRequestedView(''), null);

  const clicked = [];
  const fakeButtons = [
    { textContent: 'PDV (Balcao)', click() { clicked.push('pdv'); } },
    { textContent: 'Mesas', click() { clicked.push('mesas'); } },
    { textContent: 'Cozinha', click() { clicked.push('cozinha'); } },
    { textContent: 'Estoque', click() { clicked.push('estoque'); } },
    { textContent: 'Dashboard', click() { clicked.push('dashboard'); } },
  ];

  const doc = {
    readyState: 'complete',
    documentElement: { dataset: {} },
    querySelectorAll(selector) {
      return selector === 'aside nav button' ? fakeButtons : [];
    },
    querySelector() {
      return null;
    },
  };

  assert.equal(findNavButton(doc, 'Mesas'), fakeButtons[1]);
  assert.equal(findNavButton(doc, 'Inexistente'), null);

  const ok = applyInitialRoute({
    document: doc,
    search: '?view=cozinha',
    immediate: true,
  });

  assert.equal(ok, true);
  assert.deepEqual(clicked, ['cozinha']);
  assert.equal(doc.documentElement.dataset.plenaDemoView, 'cozinha');
  assert.equal(doc.documentElement.dataset.plenaDemoReady, 'true');
});

test('não anuncia sucesso quando a tela solicitada não carregou', () => {
  let readyCalls = 0;
  const doc = {
    readyState: 'complete',
    documentElement: { dataset: {} },
    querySelectorAll: () => [],
    querySelector: () => null,
  };
  applyInitialRoute({document:doc,search:'?view=estoque',maxAttempts:1,onReady:()=>{readyCalls++;}});
  assert.equal(doc.documentElement.dataset.plenaDemoReady,'false');
  assert.equal(doc.documentElement.dataset.plenaDemoError,'route-timeout');
  assert.equal(readyCalls,0);
});

test('anuncia sucesso depois de confirmar o título da tela solicitada', () => {
  let heading='Dashboard';
  let readyView;
  const doc = {
    readyState:'complete',documentElement:{dataset:{}},
    querySelectorAll:()=>[{textContent:'Mesas',click(){heading='Mesas';}}],
    querySelector:selector=>selector==='main h1'?{textContent:heading}:null,
  };
  applyInitialRoute({document:doc,search:'?view=mesas',maxAttempts:1,onReady:view=>{readyView=view;}});
  assert.equal(doc.documentElement.dataset.plenaDemoReady,'true');
  assert.equal(readyView,'mesas');
});
