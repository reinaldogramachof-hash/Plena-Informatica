const test = require('node:test');
const assert = require('node:assert/strict');
const BarbeariaDemoEntry = require('../tecnologia/demos/gestao-barbearia/js/demo-entry.js');

test('a entrada da demo do Barbearia Premium abre agenda, barbeiros, financeiro e pdv', () => {
  const calls = [];
  const actions = {
    navigate(view) {
      calls.push(view);
    },
  };

  assert.equal(BarbeariaDemoEntry.open('?view=agenda', actions), true);
  assert.deepEqual(calls.splice(0), ['agenda']);

  assert.equal(BarbeariaDemoEntry.open('?view=team', actions), true);
  assert.deepEqual(calls.splice(0), ['team']);

  assert.equal(BarbeariaDemoEntry.open('?view=finance', actions), true);
  assert.deepEqual(calls.splice(0), ['finance']);

  assert.equal(BarbeariaDemoEntry.open('?view=pdv', actions), true);
  assert.deepEqual(calls.splice(0), ['pdv']);

  assert.equal(BarbeariaDemoEntry.open('?view=inventory', actions), true);
  assert.deepEqual(calls.splice(0), ['inventory']);

  assert.equal(BarbeariaDemoEntry.open('', actions), false);
  assert.equal(BarbeariaDemoEntry.open('?view=desconhecida', actions), false);
  assert.deepEqual(calls, []);
});
