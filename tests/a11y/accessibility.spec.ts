import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures/test';

/**
 * Acessibilidade automatizada com axe-core (regras WCAG 2.1 A/AA).
 * O relatório completo de cada página é anexado ao relatório HTML.
 * A suíte falha se houver violações de impacto "critical".
 */
async function scan(page: import('@playwright/test').Page, name: string) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  await test.info().attach(`axe-${name}.json`, {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  const summary = results.violations.map((v) => `${v.impact} – ${v.id} (${v.nodes.length} elemento(s))`);
  test.info().annotations.push({ type: 'a11y', description: summary.join(' | ') || 'Nenhuma violação' });

  return results.violations;
}

test.describe('Acessibilidade (WCAG 2.1 AA)', () => {
  test('CT-20 tela de login sem violações críticas @a11y', async ({ loginPage, page }) => {
    await loginPage.goto();
    const violations = await scan(page, 'login');
    expect(violations.filter((v) => v.impact === 'critical')).toEqual([]);
  });

  test('CT-21 catálogo de produtos sem violações críticas @a11y', async ({ loggedIn, page }) => {
    await expect(loggedIn.items.first()).toBeVisible();
    const violations = await scan(page, 'catalogo');
    expect(violations.filter((v) => v.impact === 'critical')).toEqual([]);
  });
});
