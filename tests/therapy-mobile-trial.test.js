const test = require('node:test');
const assert = require('node:assert/strict');
const { createEntry } = require('../produtos/assets/gestao-terapia-demo-access.js');

test('no celular, uma chamada contextual solicita teste sem abrir a demo', () => {
  const calls = [];
  const open = createEntry({ isMobile: () => true, openDemo: () => calls.push('demo'), requestTrial: () => calls.push('trial') });
  open({ view: 'patients' });
  assert.deepEqual(calls, ['trial']);
});

test('no desktop, mantém a entrada contextual e a abertura genérica', () => {
  const calls = [];
  const open = createEntry({ isMobile: () => false, openDemo: parameters => calls.push(parameters), requestTrial: () => calls.push('trial') });
  open({ view: 'financial' });
  open();
  assert.deepEqual(calls, [{ view: 'financial' }, {}]);
});

test('a ação acompanha a mudança de largura após a abertura da página', () => {
  let mobile = true;
  const calls = [];
  const open = createEntry({ isMobile: () => mobile, openDemo: () => calls.push('demo'), requestTrial: () => calls.push('trial') });
  open();
  mobile = false;
  open();
  assert.deepEqual(calls, ['trial', 'demo']);
});

test('o adaptador instalado fecha o menu e prepara a solicitação no WhatsApp', () => {
  const fs = require('node:fs');
  const vm = require('node:vm');
  const calls = [];
  const context = vm.createContext({
    matchMedia: () => ({ matches: true }),
    openDemoModal: () => calls.push('demo'),
    toggleProductMobileMenu: value => calls.push(['menu', value]),
    openProductWhatsApp: (message, source) => calls.push(['whatsapp', message, source]),
  });
  vm.runInContext('window = globalThis', context);
  vm.runInContext(fs.readFileSync(require.resolve('../produtos/assets/gestao-terapia-demo-access.js'), 'utf8'), context);
  context.openDemoModal({ view: 'patients' });
  assert.deepEqual(calls[0], ['menu', false]);
  assert.equal(calls[1][0], 'whatsapp');
  assert.match(calls[1][1], /7 dias gratuitos/);
  assert.equal(calls[1][2], 'Gestão Terapia');
  assert.equal(calls.length, 2);
});
