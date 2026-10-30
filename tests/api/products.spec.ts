import { test, expect } from '@playwright/test';
import { productListSchema, productSchema, validateContract } from './schemas';

test.describe('API – Produtos', () => {
  test('API-01 listar produtos respeita o contrato e a paginação @smoke', async ({ request }) => {
    const response = await request.get('/products', { params: { limit: 10, skip: 5 } });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(validateContract(productListSchema, body)).toEqual([]);
    expect(body.products).toHaveLength(10);
    expect(body.skip).toBe(5);
    expect(body.products[0].id).toBe(6);
  });

  test('API-02 buscar produto por ID existente @regression', async ({ request }) => {
    const response = await request.get('/products/1');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(validateContract(productSchema, body)).toEqual([]);
    expect(body.id).toBe(1);
  });

  test('API-03 buscar produto inexistente retorna 404 com mensagem @regression', async ({ request }) => {
    const response = await request.get('/products/999999');
    expect(response.status()).toBe(404);
    expect((await response.json()).message).toContain('not found');
  });

  test('API-04 pesquisa retorna apenas produtos relacionados ao termo @regression', async ({ request }) => {
    const response = await request.get('/products/search', { params: { q: 'phone' } });
    expect(response.status()).toBe(200);
    const { products } = await response.json();
    expect(products.length).toBeGreaterThan(0);
    for (const p of products) {
      expect(`${p.title} ${p.description} ${p.category}`.toLowerCase()).toContain('phone');
    }
  });

  /** Técnica: valor limite na paginação (limit = 0, 1 e acima do total). */
  for (const limit of [1, 30]) {
    test(`API-05 paginação devolve exatamente ${limit} item(ns) @regression`, async ({ request }) => {
      const body = await (await request.get('/products', { params: { limit } })).json();
      expect(body.products).toHaveLength(limit);
    });
  }

  test('API-06 regra de negócio: preços positivos e desconto entre 0% e 100% @regression', async ({ request }) => {
    const { products } = await (await request.get('/products', { params: { limit: 0 } })).json();
    expect(products.length).toBeGreaterThan(0);
    for (const p of products) {
      expect.soft(p.price, `preço do produto ${p.id}`).toBeGreaterThan(0);
      expect.soft(p.discountPercentage, `desconto do produto ${p.id}`).toBeGreaterThanOrEqual(0);
      expect.soft(p.discountPercentage, `desconto do produto ${p.id}`).toBeLessThanOrEqual(100);
    }
  });

  test('API-07 CRUD: criar, atualizar e excluir produto @regression', async ({ request }) => {
    const created = await request.post('/products/add', { data: { title: 'Produto QA', price: 99.9 } });
    expect(created.status()).toBe(201);
    expect(await created.json()).toMatchObject({ title: 'Produto QA', price: 99.9 });

    const updated = await request.put('/products/1', { data: { price: 10 } });
    expect(updated.status()).toBe(200);
    expect((await updated.json()).price).toBe(10);

    const deleted = await request.delete('/products/1');
    expect(deleted.status()).toBe(200);
    expect(await deleted.json()).toMatchObject({ id: 1, isDeleted: true });
  });
});
