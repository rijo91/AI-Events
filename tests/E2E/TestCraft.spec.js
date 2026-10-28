// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'https://demo.nopcommerce.com',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
});

// pages/login.page.js

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.rememberMeCheckbox = page.locator('#RememberMe');
    this.forgotPasswordLink = page.locator('a[href="/passwordrecovery"]');
    this.emailValidationMessage = page.locator(
      'span[data-valmsg-for="Email"]'
    );
    this.passwordValidationMessage = page.locator(
      'span[data-valmsg-for="Password"]'
    );
    this.passwordEye = page.locator('.password-eye');
    this.loginButton = page.locator(
      'button.login-button, input.login-button'
    );
    this.loginForm = page.locator('form').filter({
      has: page.locator('#Email')
    });
    this.emailLabel = page.locator('label[for="Email"]');
    this.passwordLabel = page.locator('label[for="Password"]');
    this.rememberMeLabel = page.locator('label[for="RememberMe"]');
    this.pageHeading = page.locator('h1, .page-title');
    this.errorSummary = page.locator(
      '.message-error, .validation-summary-errors, .field-validation-error'
    );
  }

  async goto() {
    await this.page.goto('/login?returnUrl=%2F');
  }

  async enterEmail(email) {
    await this.emailInput.fill(email);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async fillCredentials(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
  }

  async selectRememberMe() {
    await this.rememberMeCheckbox.check();
  }

  async unselectRememberMe() {
    await this.rememberMeCheckbox.uncheck();
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(email, password, rememberMe = false) {
    await this.fillCredentials(email, password);

    if (rememberMe) {
      await this.selectRememberMe();
    }

    await this.clickLogin();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async togglePasswordVisibility() {
    await this.passwordEye.click();
  }

  async submitWithEnter() {
    await this.passwordInput.press('Enter');
  }

  async getEmailValidationText() {
    return this.emailValidationMessage.textContent();
  }

  async getPasswordValidationText() {
    return this.passwordValidationMessage.textContent();
  }
}

// tests/login.spec.js
import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display the login page with the expected URL', async ({ page }) => {
    await expect(page).toHaveURL(/\/login\?returnUrl=%2F$/);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should display the email field with the correct attributes', async () => {
    await expect(loginPage.emailInput).toHaveAttribute('id', 'Email');
    await expect(loginPage.emailInput).toHaveAttribute('name', 'Email');
    await expect(loginPage.emailInput).toHaveAttribute('type', 'email');
    await expect(loginPage.emailInput).toHaveAttribute('autofocus', '');
  });

  test('should display the password field with the correct attributes', async () => {
    await expect(loginPage.passwordInput).toHaveAttribute('id', 'Password');
    await expect(loginPage.passwordInput).toHaveAttribute('name', 'Password');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should associate the email label with the email input', async () => {
    await expect(loginPage.emailLabel).toHaveText('Email:');
    await expect(loginPage.emailLabel).toHaveAttribute('for', 'Email');
  });

  test('should associate the password label with the password input', async () => {
    await expect(loginPage.passwordLabel).toHaveText('Password:');
    await expect(loginPage.passwordLabel).toHaveAttribute('for', 'Password');
  });

  test('should display the remember me checkbox and forgot password link', async () => {
    await expect(loginPage.rememberMeCheckbox).toBeVisible();
    await expect(loginPage.rememberMeCheckbox).toHaveAttribute(
      'name',
      'RememberMe'
    );
    await expect(loginPage.rememberMeLabel).toHaveText('Remember me?');
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toHaveText('Forgot password?');
    await expect(loginPage.forgotPasswordLink).toHaveAttribute(
      'href',
      '/passwordrecovery'
    );
  });

  test('should keep the password masked by default', async () => {
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should toggle password visibility when the password eye is clicked', async () => {
    await loginPage.enterPassword('SecretPassword123');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    await loginPage.togglePasswordVisibility();

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    await loginPage.togglePasswordVisibility();

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should allow the user to select and clear Remember me', async () => {
    await expect(loginPage.rememberMeCheckbox).not.toBeChecked();

    await loginPage.selectRememberMe();
    await expect(loginPage.rememberMeCheckbox).toBeChecked();

    await loginPage.unselectRememberMe();
    await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
  });

  test('should show required validation messages when submitting an empty form', async () => {
    await loginPage.clickLogin();

    await expect(loginPage.emailValidationMessage).toContainText(
      'Please enter your email'
    );
    await expect(loginPage.passwordValidationMessage).toBeVisible();
  });

  test('should show an email validation message for an invalid email address', async () => {
    await loginPage.enterEmail('invalid-email');
    await loginPage.enterPassword('Password123');
    await loginPage.clickLogin();

    await expect(loginPage.emailValidationMessage).toContainText(
      'Wrong email'
    );
  });

  test('should accept a valid email format', async () => {
    await loginPage.enterEmail('user@example.com');

    await expect(loginPage.emailValidationMessage).toHaveText('');
  });

  test('should preserve entered values before submitting', async () => {
    await loginPage.fillCredentials('user@example.com', 'Password123');

    await expect(loginPage.emailInput).toHaveValue('user@example.com');
    await expect(loginPage.passwordInput).toHaveValue('Password123');
  });

  test('should navigate to the password recovery page', async ({ page }) => {
    await loginPage.clickForgotPassword();

    await expect(page).toHaveURL(/\/passwordrecovery$/);
    await expect(page.locator('body')).toContainText(
      /forgotten password|password recovery|recover/i
    );
  });

  test('should display an error for invalid login credentials', async ({ page }) => {
    await loginPage.login(
      'invalid.user@example.com',
      'IncorrectPassword123'
    );

    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.errorSummary.first()).toBeVisible();
    await expect(page.locator('body')).toContainText(
      /unsuccessful|incorrect|invalid|login/i
    );
  });

  test('should submit the login form using the Enter key', async ({ page }) => {
    await loginPage.fillCredentials(
      'invalid.user@example.com',
      'IncorrectPassword123'
    );
    await loginPage.submitWithEnter();

    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.errorSummary.first()).toBeVisible();
  });

  test('should submit with Remember me selected', async ({ page }) => {
    await loginPage.login(
      'invalid.user@example.com',
      'IncorrectPassword123',
      true
    );

    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.errorSummary.first()).toBeVisible();
  });

  test('should retain the return URL in the login page address', async ({
    page
  }) => {
    await expect(page).toHaveURL(/returnUrl=%2F/);
  });

  test('should focus the email field when the page is opened', async () => {
    await expect(loginPage.emailInput).toBeFocused();
  });

  test('should not expose the password value through the input type', async () => {
    await loginPage.enterPassword('SensitivePassword123');

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.passwordInput).toHaveValue(
      'SensitivePassword123'
    );
  });

  test('should allow clearing the email field', async () => {
    await loginPage.enterEmail('user@example.com');
    await expect(loginPage.emailInput).toHaveValue('user@example.com');

    await loginPage.emailInput.clear();

    await expect(loginPage.emailInput).toHaveValue('');
  });

  test('should allow clearing the password field', async () => {
    await loginPage.enterPassword('Password123');
    await expect(loginPage.passwordInput).toHaveValue('Password123');

    await loginPage.passwordInput.clear();

    await expect(loginPage.passwordInput).toHaveValue('');
  });

  test('should support a complex valid email address', async () => {
    await loginPage.enterEmail('first.last+automation@example.co.uk');
    await loginPage.enterPassword('Password123');
    await loginPage.clickLogin();

    await expect(loginPage.emailValidationMessage).toHaveText('');
  });

  test('should display the login button with a usable label', async () => {
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();

    const buttonText = await loginPage.loginButton.first().textContent();
    const buttonValue = await loginPage.loginButton.first().getAttribute('value');

    expect(`${buttonText || ''}${buttonValue || ''}`).toMatch(/log\s*in/i);
  });
});