const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadTheme(blockStorage = false) {
  const values = new Map([
    ['terapia_theme_preference', 'dark'],
    ['terapia_accent_palette', 'blue'],
  ]);
  const classes = new Set(['dark']);
  const style = { setProperty(key, value) { this[key] = value; } };
  const context = vm.createContext({
    localStorage: {
      getItem(key) { if (blockStorage) throw new Error('Storage unavailable'); return values.get(key); },
      setItem(key, value) { if (blockStorage) throw new Error('Storage unavailable'); values.set(key, value); },
    },
    document: {
      documentElement: { style, classList: {
        contains: key => classes.has(key),
        toggle(key, active) { active ? classes.add(key) : classes.delete(key); },
      } },
      querySelector: () => null,
      getElementById: () => null,
      addEventListener() {},
    },
    window: { addEventListener() {} },
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../tecnologia/demos/gestao-terapia/assets/js/theme.js'), 'utf8'), context);
  return { context, style, classes };
}

test('a demonstração inicia clara e esmeralda mesmo com preferências antigas', () => {
  const { style, classes } = loadTheme();
  assert.equal(classes.has('dark'), false);
  assert.equal(style.colorScheme, 'light');
  assert.equal(style['--color-accent'], '#047857');
});

test('o visitante ainda pode experimentar tema e paleta durante a sessão', () => {
  const { context, style, classes } = loadTheme();
  vm.runInContext("applySorveteriaTheme('dark', true); applyTherapyPalette('rose', true)", context);
  assert.equal(classes.has('dark'), true);
  assert.equal(style['--color-accent'], '#BE185D');
});

test('o padrão claro e esmeralda funciona com armazenamento indisponível', () => {
  const { style, classes } = loadTheme(true);
  assert.equal(classes.has('dark'), false);
  assert.equal(style['--color-accent'], '#047857');
});
