import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { HealthController } = require('../dist/health.controller');

test('HealthController.check returns ok status and ISO timestamp', () => {
  const result = new HealthController().check();

  assert.equal(result.status, 'ok');
  assert.equal(Number.isNaN(Date.parse(result.timestamp)), false);
});
