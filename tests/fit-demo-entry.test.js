const test = require('node:test');
const assert = require('node:assert/strict');
const FitDemoEntry = require('../tecnologia/demos/gestao-fit/assets/js/demo-entry.js');

test('a entrada da demo do Gestão Fit abre agenda, ficha do aluno e financeiro', () => {
  const calls = [];
  const actions = {
    navigate(view) {
      calls.push(['navigate', view]);
    },
    openStudent(id) {
      calls.push(['openStudent', id]);
    },
  };

  assert.equal(FitDemoEntry.open('?view=schedule', actions), true);
  assert.deepEqual(calls.splice(0), [['navigate', 'schedule']]);

  assert.equal(FitDemoEntry.open('?view=clients', actions), true);
  assert.deepEqual(calls.splice(0), [
    ['navigate', 'clients'],
    ['openStudent', 'cli-01'],
  ]);

  assert.equal(FitDemoEntry.open('?view=finance', actions), true);
  assert.deepEqual(calls.splice(0), [['navigate', 'finance']]);

  assert.equal(FitDemoEntry.open('', actions), false);
  assert.equal(FitDemoEntry.open('?view=desconhecida', actions), false);
  assert.deepEqual(calls, []);
});
