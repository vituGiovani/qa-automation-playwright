import { test, expect } from '../../fixtures/test';
import { messages } from '../../data/users';
import { TAX_RATE, customer, products } from '../../data/products';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(products.backpack.id);
    await loggedIn.addToCart(products.bikeLight.id);
    await loggedIn.openCart();
    await cartPage.checkout();
  });

  test('CT-15 compra completa de ponta a ponta @smoke', async ({ checkoutPage, page }) => {
    await checkoutPage.fillInformation(customer);
    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText(messages.orderComplete);
    await test.info().attach('evidencia-pedido-concluido', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  });

  test('CT-16 resumo calcula subtotal, taxa (8%) e total corretamente @regression', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation(customer);
    const summary = await checkoutPage.getSummary();

    const expectedSubtotal = products.backpack.price + products.bikeLight.price;
    const expectedTax = Math.round(expectedSubtotal * TAX_RATE * 100) / 100;

    expect(summary.prices).toEqual([products.backpack.price, products.bikeLight.price]);
    expect(summary.subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(summary.tax).toBeCloseTo(expectedTax, 2);
    expect(summary.total).toBeCloseTo(expectedSubtotal + expectedTax, 2);
  });

  /** Técnica: partição de equivalência – um campo obrigatório vazio por vez. */
  const requiredFields = [
    { id: 'CT-17', field: 'Nome', data: { ...customer, firstName: '' }, message: messages.firstNameRequired },
    { id: 'CT-18', field: 'Sobrenome', data: { ...customer, lastName: '' }, message: messages.lastNameRequired },
    { id: 'CT-19', field: 'CEP', data: { ...customer, postalCode: '' }, message: messages.postalCodeRequired },
  ];

  for (const c of requiredFields) {
    test(`${c.id} checkout bloqueado sem ${c.field} @regression`, async ({ checkoutPage, page }) => {
      await checkoutPage.fillInformation(c.data);
      await checkoutPage.expectError(c.message);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }
});
