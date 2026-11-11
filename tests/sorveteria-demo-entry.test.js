const test = require('node:test');
const assert = require('node:assert/strict');
const SorveteriaDemoEntry = require('../tecnologia/demos/gestao-sorveteria/assets/js/demo-entry.js');

test('a entrada da demo do Gestão Sorveteria abre frente de caixa, produção e freezers', () => {
  const calls = [];
  const actions = {
    navigate(view) {
      calls.push(view);
    },
  };

  assert.equal(SorveteriaDemoEntry.open('?view=cashier', actions), true);
  assert.deepEqual(calls.splice(0), ['cashier']);

  assert.equal(SorveteriaDemoEntry.open('?view=production', actions), true);
  assert.deepEqual(calls.splice(0), ['production']);

  assert.equal(SorveteriaDemoEntry.open('?view=temperature', actions), true);
  assert.deepEqual(calls.splice(0), ['temperature']);

  assert.equal(SorveteriaDemoEntry.open('', actions), false);
  assert.equal(SorveteriaDemoEntry.open('?view=desconhecida', actions), false);
  assert.deepEqual(calls, []);
});
