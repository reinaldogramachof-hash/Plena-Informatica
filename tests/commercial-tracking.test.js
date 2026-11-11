const test = require('node:test');
const assert = require('node:assert/strict');
const { buildEvent } = require('../assets/commercial-tracking.js');

test('classifica a intenção sem transformá-la em venda ou lead confirmado', () => {
  assert.deepEqual(buildEvent({ kind:'trial', offer:'gestao-terapia', pathname:'/produtos/gestao-terapia.html' }), {
    event:'plena_commercial_click', intent:'trial', offer:'gestao-terapia', page_path:'/produtos/gestao-terapia.html', destination_path:''
  });
});
test('aceita somente campanhas permitidas e não inclui outros parâmetros da URL', () => {
  const event = buildEvent({ kind:'whatsapp', pathname:'/', search:'?utm_source=instagram&utm_medium=social&utm_campaign=terapia&email=cliente@example.com&text=mensagem' });
  assert.equal(event.utm_source, 'instagram');
  assert.equal(event.utm_medium, 'social');
  assert.equal(event.utm_campaign, 'terapia');
  assert.equal('email' in event, false);
  assert.equal('text' in event, false);
});
test('rejeita intenções desconhecidas e identificadores de campanha inadequados', () => {
  assert.equal(buildEvent({kind:'purchase',pathname:'/'}),null);
  assert.equal(buildEvent({kind:'service',pathname:'/',search:'?utm_campaign=cliente%40example.com'}).utm_campaign,undefined);
});

test('o listener de clique envia somente contexto comercial para a fila de eventos', () => {
  const fs = require('node:fs');
  const vm = require('node:vm');
  let listener;
  const context = vm.createContext({
    URL, URLSearchParams,
    document: { body:{dataset:{}}, addEventListener(name, callback) { if (name==='click') listener=callback; } },
    location: {href:'https://plenainformatica.com.br/?utm_source=instagram',origin:'https://plenainformatica.com.br',pathname:'/',search:'?utm_source=instagram'},
    matchMedia:()=>({matches:false}),
  });
  vm.runInContext(fs.readFileSync(require.resolve('../assets/commercial-tracking.js'),'utf8'),context);
  const control={ dataset:{plenaKind:'service',plenaOffer:'sites'}, innerText:'Sites profissionais', classList:{contains:()=>false}, hasAttribute:()=>false, getAttribute:name=>name==='href'?'/tecnologia/sites-premium/?text=privado':null };
  listener({target:{closest:()=>control}});
  assert.equal(context.dataLayer.length,1);
  assert.equal(context.dataLayer[0].destination_path,'/tecnologia/sites-premium/');
  assert.equal(context.dataLayer[0].utm_source,'instagram');
  assert.equal(JSON.stringify(context.dataLayer).includes('privado'),false);
});
