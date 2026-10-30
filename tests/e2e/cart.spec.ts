import { test, expect } from '../../fixtures/test';
import { products } from '../../data/products';

test.describe('Catálogo e carrinho', () => {
  test('CT-08 adicionar produtos atualiza o contador do carrinho @smoke', async ({ loggedIn }) => {
    await loggedIn.addToCart(products.backpack.id);
    await expect(loggedIn.cartBadge).toHaveText('1');
    await loggedIn.addToCart(products.bikeLight.id);
    await expect(loggedIn.cartBadge).toHaveText('2');
  });

  test('CT-09 remover produto atualiza o contador do carrinho @regression', async ({ loggedIn }) => {
    await loggedIn.addToCart(products.backpack.id);
    await loggedIn.addToCart(products.bikeLight.id);
    await loggedIn.removeFromCart(products.backpack.id);
    await expect(loggedIn.cartBadge).toHaveText('1');
    await loggedIn.removeFromCart(products.bikeLight.id);
    await expect(loggedIn.cartBadge).toBeHidden();
  });

  test('CT-10 carrinho exibe exatamente os itens adicionados @regression', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(products.backpack.id);
    await loggedIn.addToCart(products.onesie.id);
    await loggedIn.openCart();
    await expect(cartPage.itemNames).toHaveText([products.backpack.name, products.onesie.name]);
  });

  test('CT-11 carrinho mantém os itens após recarregar a página @regression', async ({ loggedIn, cartPage, page }) => {
    await loggedIn.addToCart(products.backpack.id);
    await page.reload();
    await expect(loggedIn.cartBadge).toHaveText('1');
    await loggedIn.openCart();
    await expect(cartPage.items).toHaveCount(1);
  });

  test.describe('Ordenação', () => {
    test('CT-12 ordenar por nome Z → A @regression', async ({ loggedIn }) => {
      await loggedIn.sortBy('za');
      const names = await loggedIn.getNames();
      expect(names).toEqual([...names].sort().reverse());
    });

    test('CT-13 ordenar por preço do menor para o maior @regression', async ({ loggedIn }) => {
      await loggedIn.sortBy('lohi');
      const prices = await loggedIn.getPrices();
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test('CT-14 ordenar por preço do maior para o menor @regression', async ({ loggedIn }) => {
      await loggedIn.sortBy('hilo');
      const prices = await loggedIn.getPrices();
      expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });
  });
});
