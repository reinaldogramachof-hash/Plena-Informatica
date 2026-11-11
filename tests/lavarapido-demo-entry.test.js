const test = require('node:test');
const assert = require('node:assert/strict');
const LavarapidoDemoEntry = require('../tecnologia/demos/gestao-lavarapido/assets/js/demo-entry.js');

test('a entrada da demo do Gestão Lava-Rápido abre pátio, ordens de serviço e caixa', () => {
  const calls = [];
  const actions = {
    navigate(view) {
      calls.push(view);
    },
  };

  assert.equal(LavarapidoDemoEntry.open('?view=patio', actions), true);
  assert.deepEqual(calls.splice(0), ['patio']);

  assert.equal(LavarapidoDemoEntry.open('?view=ordens', actions), true);
  assert.deepEqual(calls.splice(0), ['ordens']);

  assert.equal(LavarapidoDemoEntry.open('?view=caixa', actions), true);
  assert.deepEqual(calls.splice(0), ['caixa']);

  assert.equal(LavarapidoDemoEntry.open('', actions), false);
  assert.equal(LavarapidoDemoEntry.open('?view=desconhecida', actions), false);
  assert.deepEqual(calls, []);
});
