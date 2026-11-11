const test = require('node:test');
const assert = require('node:assert/strict');
const BelezaDemoEntry = require('../tecnologia/demos/gestao-beleza/js/demo-entry.js');

test('a entrada da demo do Gestão Beleza Pro abre agenda, clientes, financeiro e estoque', () => {
  const calls = [];
  const actions = {
    navigate(view) {
      calls.push(view);
    },
  };

  assert.equal(BelezaDemoEntry.open('?view=agenda', actions), true);
  assert.deepEqual(calls.splice(0), ['agenda']);

  assert.equal(BelezaDemoEntry.open('?view=clients', actions), true);
  assert.deepEqual(calls.splice(0), ['clients']);

  assert.equal(BelezaDemoEntry.open('?view=team', actions), true);
  assert.deepEqual(calls.splice(0), ['team']);

  assert.equal(BelezaDemoEntry.open('?view=finance', actions), true);
  assert.deepEqual(calls.splice(0), ['finance']);

  assert.equal(BelezaDemoEntry.open('?view=inventory', actions), true);
  assert.deepEqual(calls.splice(0), ['inventory']);

  assert.equal(BelezaDemoEntry.open('?view=reports', actions), true);
  assert.deepEqual(calls.splice(0), ['reports']);

  assert.equal(BelezaDemoEntry.open('', actions), false);
  assert.equal(BelezaDemoEntry.open('?view=invalida', actions), false);
  assert.deepEqual(calls, []);
});
