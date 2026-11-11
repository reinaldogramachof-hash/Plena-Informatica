const test = require('node:test');
const assert = require('node:assert/strict');

const entries = [
  ['assistencia','../tecnologia/demos/gestao-assistencia/assets/js/demo-entry.js'],
  ['barbearia','../tecnologia/demos/gestao-barbearia/js/demo-entry.js'],
  ['beleza','../tecnologia/demos/gestao-beleza/js/demo-entry.js'],
  ['lavarapido','../tecnologia/demos/gestao-lavarapido/assets/js/demo-entry.js'],
  ['pdv','../tecnologia/demos/gestao-pdv/assets/js/demo-entry.js'],
  ['sorveteria','../tecnologia/demos/gestao-sorveteria/assets/js/demo-entry.js'],
];
for (const [name,file] of entries) {
  test(`${name}: parâmetros não podem selecionar propriedades herdadas como telas`,()=>{
    const entry=require(file);
    for(const value of ['constructor','__proto__','toString']) {
      assert.equal(entry.resolveView(`?view=${value}`),'');
      let navigated=false;
      assert.equal(entry.open(`?view=${value}`,{navigate(){navigated=true;}}),false);
      assert.equal(navigated,false);
    }
  });
}
