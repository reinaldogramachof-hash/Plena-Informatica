const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const rootDir = path.resolve(__dirname, '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function getHeroImageTag(html) {
  const match = html.match(/<img\b[^>]*id=["']hero-image["'][^>]*>/i);
  assert.ok(match, 'index.html should render a hero image with id="hero-image"');
  return match[0];
}

test('hero image is rendered and no video is present', () => {
  const html = readProjectFile('index.html');
  const script = readProjectFile('script.js');
  
  // Verify image exists
  const heroImageTag = getHeroImageTag(html);
  assert.match(heroImageTag, /src=["']plena\.jpg["']/i, 'hero image should reference ../assets/images/plena.jpg');

  // Verify video tag is removed
  assert.doesNotMatch(html, /<video\b[^>]*id=["']hero-video["'][^>]*>/i, 'hero video should be removed');

  // Verify no video reverse logic exists in script
  assert.doesNotMatch(
    script,
    /Hero Video Yoyo Effect|startReversing|fastSeek|reverseFps|reverseSpeed|currentTime\s*=/,
    'script.js should not seek the hero video backwards for a yoyo effect',
  );
});
