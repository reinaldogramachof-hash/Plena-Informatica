const test = require('node:test');
const assert = require('node:assert/strict');
const entry = require('../tecnologia/demos/gestao-odonto/assets/js/demo-entry');

test('a entrada da demo do Gestão Odonto abre agenda, prontuário específico e financeiro', () => {
  const calls = [];
  const api = {
    navigate: (view) => calls.push(['navigate', view]),
    openPatient: (id) => {
      calls.push(['openPatient', id]);
      return true;
    },
  };

  assert.equal(entry.open('?view=schedule', api), true);
  assert.equal(entry.open('?view=patients', api), true);
  assert.equal(entry.open('?view=financial', api), true);
  assert.equal(entry.open('', api), false);
  assert.equal(entry.open('?view=<script>', api), false);
  assert.equal(entry.open('?view=dashboard', api), false);

  assert.deepEqual(calls, [
    ['navigate', 'schedule'],
    ['openPatient', 'pat_1'],
    ['navigate', 'financial'],
  ]);
});
