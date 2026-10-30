import { test, expect } from '../../fixtures/test';
import { PASSWORD, users } from '../../data/users';
import { customer } from '../../data/products';

/**
 * Defeitos conhecidos encontrados pela suíte (usuário "problem_user").
 *
 * Os testes descrevem o comportamento ESPERADO e estão marcados com test.fail():
 * - enquanto o bug existir, o teste falha "como esperado" e a pipeline continua verde;
 * - quando o bug for corrigido, o Playwright acusa "passou inesperadamente",
 *   avisando que a issue pode ser fechada e o test.fail() removido.
 *
 * Cada caso aponta para o bug report em docs/bugs.md e nas Issues do GitHub.
 */
test.describe('Defeitos conhecidos – problem_user', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.problem, PASSWORD);
    await inventoryPage.expectLoaded();
  });

  test('BUG-01 cada produto deve exibir sua própria imagem', async ({ inventoryPage }) => {
    test.info().annotations.push({ type: 'issue', description: 'BUG-01 – Imagens de produto repetidas' });
    test.fail();
    const sources = await inventoryPage.itemImages.evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src')));
    expect(new Set(sources).size).toBe(sources.length);
  });

  test('BUG-02 ordenação Z → A deve reordenar a lista', async ({ inventoryPage }) => {
    test.info().annotations.push({ type: 'issue', description: 'BUG-02 – Ordenação não funciona' });
    test.fail();
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('BUG-03 campo Sobrenome deve aceitar o texto digitado no checkout', async ({ inventoryPage, cartPage, checkoutPage }) => {
    test.info().annotations.push({ type: 'issue', description: 'BUG-03 – Campo Sobrenome não aceita digitação' });
    test.fail();
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.lastName.fill(customer.lastName);
    await expect(checkoutPage.lastName).toHaveValue(customer.lastName);
  });
});
