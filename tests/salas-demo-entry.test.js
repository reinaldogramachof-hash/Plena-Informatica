const test = require('node:test');
const assert = require('node:assert/strict');
const entry = require('../tecnologia/demos/gestao-salas/assets/js/demo-entry.js');

test('a entrada da demo do Gestão Salas abre os três módulos em tela contextual', () => {
  const calls = [];
  const api = {
    navigate(view) { calls.push(['navigate', view]); },
    showGrid() { calls.push(['showGrid']); },
    openVistoria(id) { calls.push(['openVistoria', id]); },
  };

  assert.equal(entry.open('?view=bookings', api), true);
  assert.deepEqual(calls.slice(-2), [['navigate', 'bookings'], ['showGrid']]);

  assert.equal(entry.open('?view=vistoria', api), true);
  assert.deepEqual(calls.slice(-2), [['navigate', 'bookings'], ['openVistoria', 'bk_001']]);

  assert.equal(entry.open('?view=finances', api), true);
  assert.deepEqual(calls.at(-1), ['navigate', 'finances']);

  const countBefore = calls.length;
  assert.equal(entry.open('?view=settings', api), false);
  assert.equal(entry.open('', api), false);
  assert.equal(calls.length, countBefore);
});
