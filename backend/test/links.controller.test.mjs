import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { LinksController } = require('../dist/links/links.controller');

test('LinksController.findAll reads active links by default', async () => {
  const calls = [];
  const controller = new LinksController({
    findAll: async (includeInactive) => {
      calls.push(includeInactive);
      return [{ title: 'Jira' }];
    },
  });

  const result = await controller.findAll();

  assert.deepEqual(result, [{ title: 'Jira' }]);
  assert.deepEqual(calls, [false]);
});

test('LinksController.findAll can include inactive links for admin views', async () => {
  const calls = [];
  const controller = new LinksController({
    findAll: async (includeInactive) => {
      calls.push(includeInactive);
      return [];
    },
  });

  await controller.findAll('true');

  assert.deepEqual(calls, [true]);
});

test('LinksController delegates write operations to the link service', async () => {
  const calls = [];
  const service = {
    create: async (payload) => {
      calls.push(['create', payload]);
      return { _id: '1', ...payload };
    },
    update: async (id, payload) => {
      calls.push(['update', id, payload]);
      return { _id: id, ...payload };
    },
    remove: async (id) => {
      calls.push(['remove', id]);
      return { deleted: true };
    },
  };
  const controller = new LinksController(service);

  await controller.create({ title: 'Grafana' });
  await controller.update('1', { title: 'Grafana Cloud' });
  await controller.remove('1');

  assert.deepEqual(calls, [
    ['create', { title: 'Grafana' }],
    ['update', '1', { title: 'Grafana Cloud' }],
    ['remove', '1'],
  ]);
});
