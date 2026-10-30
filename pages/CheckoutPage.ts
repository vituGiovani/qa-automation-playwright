import { type Locator, type Page, expect } from '@playwright/test';

/** Cobre as 3 etapas do checkout: informações, resumo (overview) e confirmação. */
export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly error: Locator;
  readonly itemPrices: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.error = page.getByTestId('error');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInformation(data: { firstName?: string; lastName?: string; postalCode?: string }) {
    if (data.firstName !== undefined) await this.firstName.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastName.fill(data.lastName);
    if (data.postalCode !== undefined) await this.postalCode.fill(data.postalCode);
    await this.continueButton.click();
  }

  /** Extrai o valor numérico de rótulos como "Item total: $39.98". */
  private static money(text: string | null): number {
    const match = text?.match(/\$([\d.]+)/);
    if (!match) throw new Error(`Valor monetário não encontrado em: "${text}"`);
    return Number(match[1]);
  }

  async getSummary() {
    const prices = (await this.itemPrices.allTextContents()).map((t) => CheckoutPage.money(t));
    return {
      prices,
      subtotal: CheckoutPage.money(await this.subtotal.textContent()),
      tax: CheckoutPage.money(await this.tax.textContent()),
      total: CheckoutPage.money(await this.total.textContent()),
    };
  }

  async finish() {
    await this.finishButton.click();
  }

  async expectError(message: string) {
    await expect(this.error).toHaveText(message);
  }
}
