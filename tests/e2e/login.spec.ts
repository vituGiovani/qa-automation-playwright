import { test, expect } from '../../fixtures/test';
import { PASSWORD, messages, users } from '../../data/users';

/**
 * Login – técnica: partição de equivalência.
 * Classes válidas: usuário ativo + senha correta.
 * Classes inválidas: campos vazios, credenciais erradas, usuário bloqueado.
 */
test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('CT-01 login com credenciais válidas @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard, PASSWORD);
    await inventoryPage.expectLoaded();
  });

  const invalidCases = [
    { id: 'CT-02', scenario: 'usuário vazio', user: '', pass: PASSWORD, message: messages.usernameRequired },
    { id: 'CT-03', scenario: 'senha vazia', user: users.standard, pass: '', message: messages.passwordRequired },
    { id: 'CT-04', scenario: 'senha incorreta', user: users.standard, pass: 'senha_errada', message: messages.invalidCredentials },
    { id: 'CT-05', scenario: 'usuário inexistente', user: 'usuario_fake', pass: PASSWORD, message: messages.invalidCredentials },
    { id: 'CT-06', scenario: 'usuário bloqueado', user: users.lockedOut, pass: PASSWORD, message: messages.lockedOut },
  ];

  for (const c of invalidCases) {
    test(`${c.id} login bloqueado com ${c.scenario} @regression`, async ({ loginPage, page }) => {
      await loginPage.login(c.user, c.pass);
      await loginPage.expectError(c.message);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test('CT-07 logout encerra a sessão e protege páginas internas @regression', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.standard, PASSWORD);
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();

    // Acesso direto à página interna sem sessão deve ser bloqueado
    await page.goto('/inventory.html');
    await loginPage.expectError("Epic sadface: You can only access '/inventory.html' when you are logged in.");
  });
});
