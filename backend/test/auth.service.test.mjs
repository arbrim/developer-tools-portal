import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const bcrypt = require('bcrypt');
const { UnauthorizedException } = require('@nestjs/common');
const { AuthService } = require('../dist/auth/auth.service');

test('AuthService.login returns a signed JWT and user payload for valid credentials', async () => {
  const passwordHash = await bcrypt.hash('Admin123!', 4);
  const usersService = {
    findByEmail: async (email) => ({
      id: 'user-1',
      email,
      name: 'Portal Admin',
      role: 'admin',
      passwordHash,
    }),
  };
  const jwtService = {
    signAsync: async (payload) => `signed:${payload.sub}:${payload.role}`,
  };

  const service = new AuthService(usersService, jwtService);
  const result = await service.login({ email: 'admin@example.com', password: 'Admin123!' });

  assert.equal(result.accessToken, 'signed:user-1:admin');
  assert.deepEqual(result.user, {
    sub: 'user-1',
    email: 'admin@example.com',
    name: 'Portal Admin',
    role: 'admin',
  });
});

test('AuthService.login rejects invalid credentials', async () => {
  const passwordHash = await bcrypt.hash('Admin123!', 4);
  const usersService = {
    findByEmail: async () => ({
      id: 'user-1',
      email: 'admin@example.com',
      name: 'Portal Admin',
      role: 'admin',
      passwordHash,
    }),
  };

  const service = new AuthService(usersService, { signAsync: async () => 'unused' });

  await assert.rejects(
    () => service.login({ email: 'admin@example.com', password: 'wrong-password' }),
    UnauthorizedException,
  );
});
