const test = require('node:test');
const assert = require('node:assert/strict');
const PdvDemoEntry = require('../tecnologia/demos/gestao-pdv/assets/js/demo-entry.js');

test('a entrada da demo do Gestão PDV abre frente de caixa, estoque e dashboard', () => {
  const calls = [];
  const actions = {
    navigate(view) {
      calls.push(view);
    },
  };

  assert.equal(PdvDemoEntry.open('?view=pdv', actions), true);
  assert.deepEqual(calls.splice(0), ['pdv']);

  assert.equal(PdvDemoEntry.open('?view=inventory', actions), true);
  assert.deepEqual(calls.splice(0), ['inventory']);

  assert.equal(PdvDemoEntry.open('?view=dashboard', actions), true);
  assert.deepEqual(calls.splice(0), ['dashboard']);

  assert.equal(PdvDemoEntry.open('', actions), false);
  assert.equal(PdvDemoEntry.open('?view=desconhecida', actions), false);
  assert.deepEqual(calls, []);
});
