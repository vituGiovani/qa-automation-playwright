import { test, expect } from '@playwright/test';
import { loginSchema, validateContract } from './schemas';

const VALID = { username: 'emilys', password: 'emilyspass' };

test.describe('API – Autenticação', () => {
  test('API-08 login válido retorna tokens e respeita o contrato @smoke', async ({ request }) => {
    const response = await request.post('/auth/login', { data: VALID });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(validateContract(loginSchema, body)).toEqual([]);
    expect(body.username).toBe(VALID.username);
  });

  test('API-09 login com senha inválida retorna 400 @regression', async ({ request }) => {
    const response = await request.post('/auth/login', { data: { ...VALID, password: 'errada' } });
    expect(response.status()).toBe(400);
    expect((await response.json()).message).toBe('Invalid credentials');
  });

  test('API-10 rota protegida aceita token válido @regression', async ({ request }) => {
    const { accessToken } = await (await request.post('/auth/login', { data: VALID })).json();
    const me = await request.get('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } });
    expect(me.status()).toBe(200);
    expect((await me.json()).username).toBe(VALID.username);
  });

  test('API-11 rota protegida rejeita requisição sem token (segurança) @regression', async ({ request }) => {
    const me = await request.get('/auth/me');
    expect(me.status()).toBe(401);
  });

  test('API-12 rota protegida rejeita token adulterado (segurança) @regression', async ({ request }) => {
    const me = await request.get('/auth/me', { headers: { Authorization: 'Bearer token.invalido.123' } });
    expect([401, 403, 500]).toContain(me.status());
    expect(me.status()).not.toBe(200);
  });
});
