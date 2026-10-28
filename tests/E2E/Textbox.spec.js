import { test, expect } from '@playwright/test';
import { TextBoxPage } from '../../pages/textbox.page.js';

test.describe('DemoQA Text Box page', () => {
  test('fills and submits the form using the page object model', async ({ page }) => {
    const textBoxPage = new TextBoxPage(page);

    await textBoxPage.goto();

    await expect(textBoxPage.heading).toHaveText('Text Box');
    await expect(textBoxPage.fullNameInput).toBeVisible();
    await expect(textBoxPage.emailInput).toBeVisible();
    await expect(textBoxPage.currentAddressInput).toBeVisible();
    await expect(textBoxPage.permanentAddressInput).toBeVisible();

    await textBoxPage.fillForm({
      fullName: 'John Doe',
      email: 'john@example.com',
      currentAddress: '123 Main St',
      permanentAddress: '456 Oak Ave',
    });

    await textBoxPage.waitForTimeout(9000);

    await textBoxPage.submit();

    await expect(textBoxPage.outputPanel).toBeVisible();
    await expect(textBoxPage.nameOutput).toContainText('John Doe');
    await expect(textBoxPage.emailOutput).toContainText('john@example.com');
    await expect(textBoxPage.currentAddressOutput).toContainText('123 Main St');
    await expect(textBoxPage.permanentAddressOutput).toContainText('456 Oak Ave');
    await textBoxPage.waitForTimeout(9000);
  });
});