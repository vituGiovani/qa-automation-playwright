/** Massa de dados de produtos usada nos cenários de carrinho e checkout. */
export const products = {
  backpack: { id: 'sauce-labs-backpack', name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { id: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light', price: 9.99 },
  boltTShirt: { id: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  onesie: { id: 'sauce-labs-onesie', name: 'Sauce Labs Onesie', price: 7.99 },
} as const;

export const customer = { firstName: 'Victor', lastName: 'Oliveira', postalCode: '50000-000' } as const;

/** Taxa aplicada pelo Sauce Demo no resumo do pedido. */
export const TAX_RATE = 0.08;
