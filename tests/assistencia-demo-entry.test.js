const test = require('node:test');
const assert = require('node:assert/strict');
const AssistenciaDemoEntry = require('../tecnologia/demos/gestao-assistencia/assets/js/demo-entry.js');

test('a entrada da demo do Gestão Assistência abre ordens, estoque, pdv e fluxo de caixa', () => {
  const calls = [];
  const actions = {
    navigate(view) {
      calls.push(view);
    },
  };

  assert.equal(AssistenciaDemoEntry.open('?view=orders', actions), true);
  assert.deepEqual(calls.splice(0), ['orders']);

  assert.equal(AssistenciaDemoEntry.open('?view=inventory', actions), true);
  assert.deepEqual(calls.splice(0), ['inventory']);

  assert.equal(AssistenciaDemoEntry.open('?view=pdv', actions), true);
  assert.deepEqual(calls.splice(0), ['pdv']);

  assert.equal(AssistenciaDemoEntry.open('?view=transactions', actions), true);
  assert.deepEqual(calls.splice(0), ['transactions']);

  assert.equal(AssistenciaDemoEntry.open('', actions), false);
  assert.equal(AssistenciaDemoEntry.open('?view=desconhecida', actions), false);
  assert.deepEqual(calls, []);
});
