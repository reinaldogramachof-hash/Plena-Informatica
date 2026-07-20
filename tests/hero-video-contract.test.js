const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const rootDir = path.resolve(__dirname, '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function getHeroVideoTag(html) {
  const match = html.match(/<video\b[^>]*id=["']hero-video["'][^>]*>/i);
  assert.ok(match, 'index.html should render a hero video with id="hero-video"');
  return match[0];
}

function hasBooleanAttribute(tag, attribute) {
  return new RegExp(`\\s${attribute}(?:\\s|=|>|$)`, 'i').test(tag);
}

test('hero video uses native looping instead of JavaScript reverse playback', () => {
  const html = readProjectFile('index.html');
  const script = readProjectFile('script.js');
  const heroVideoTag = getHeroVideoTag(html);

  assert.ok(hasBooleanAttribute(heroVideoTag, 'autoplay'), 'hero video should autoplay');
  assert.ok(hasBooleanAttribute(heroVideoTag, 'muted'), 'hero video should stay muted for autoplay');
  assert.ok(hasBooleanAttribute(heroVideoTag, 'playsinline'), 'hero video should play inline on mobile');
  assert.ok(
    hasBooleanAttribute(heroVideoTag, 'loop'),
    'hero video should use native loop playback to avoid seek-heavy reverse playback',
  );

  assert.doesNotMatch(
    script,
    /Hero Video Yoyo Effect|startReversing|fastSeek|reverseFps|reverseSpeed|currentTime\s*=/,
    'script.js should not seek the hero video backwards for a yoyo effect',
  );
});
