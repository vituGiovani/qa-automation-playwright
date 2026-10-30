import { test, expect } from '@playwright/test';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Validação de dados com SQL:
 * 1. busca os carrinhos na API;
 * 2. grava em um banco SQLite em memória (sql/schema.sql);
 * 3. roda as consultas de sql/validations.sql — cada uma deve retornar zero linhas.
 */
const SQL_DIR = join(__dirname, '..', '..', 'sql');

function loadValidations() {
  const content = readFileSync(join(SQL_DIR, 'validations.sql'), 'utf-8');
  return content
    .split(/^-- name: /m)
    .slice(1)
    .map((block) => {
      const [name, ...rest] = block.split('\n');
      const body = rest.join('\n');
      const bug = body.match(/^-- bug: (\S+)/m)?.[1];
      return { name: name.trim(), bug, sql: body.replace(/^-- bug: .*$/m, '').trim() };
    });
}

test.describe('Validação de dados com SQL – Carrinhos', () => {
  let db: DatabaseSync;

  test.beforeAll(async ({ request }) => {
    const response = await request.get('/carts', { params: { limit: 0 } });
    expect(response.status()).toBe(200);
    const { carts } = await response.json();

    db = new DatabaseSync(':memory:');
    db.exec(readFileSync(join(SQL_DIR, 'schema.sql'), 'utf-8'));

    const insertCart = db.prepare('INSERT INTO carts VALUES (?, ?, ?, ?, ?, ?)');
    const insertItem = db.prepare('INSERT INTO cart_items VALUES (?, ?, ?, ?, ?, ?)');
    for (const c of carts) {
      insertCart.run(c.id, c.userId, c.total, c.discountedTotal, c.totalProducts, c.totalQuantity);
      for (const p of c.products) insertItem.run(c.id, p.id, p.title, p.price, p.quantity, p.total);
    }
  });

  test.afterAll(() => db?.close());

  test('SQL-00 todos os carrinhos da API foram carregados no banco @sql', () => {
    const row = db.prepare('SELECT COUNT(*) AS qtd FROM carts').get() as { qtd: number };
    expect(row.qtd).toBeGreaterThan(0);
  });

  for (const { name, bug, sql } of loadValidations()) {
    test(`SQL – ${name} deve retornar zero inconsistências @sql`, async () => {
      if (bug) {
        // Defeito conhecido: falha esperada até a correção (ver docs/bugs.md)
        test.info().annotations.push({ type: 'issue', description: `${bug} – ver docs/bugs.md` });
        test.fail();
      }
      const rows = db.prepare(sql).all();
      if (rows.length) {
        await test.info().attach(`${name}.json`, { body: JSON.stringify(rows, null, 2), contentType: 'application/json' });
      }
      expect(rows, `Consulta: ${sql}`).toEqual([]);
    });
  }
});
