import { test, expect } from '@playwright/test';
import { CheckboxPage } from '../../pages/Checkbox.page.js';

test.describe('DemoQA Checkbox page', () => {
  test('expands the tree and toggles the home checkbox', async ({ page }) => {
    const checkboxPage = new CheckboxPage(page);

    await checkboxPage.goto();

    await expect(checkboxPage.heading).toHaveText('Check Box');
    await expect(checkboxPage.homeCheckbox).toBeVisible();
    await checkboxPage.waitForTimeout(5000);

    await checkboxPage.expandHome();
    await checkboxPage.waitForTimeout(5000);

    await expect(checkboxPage.desktopCheckbox).toBeVisible();
    await expect(checkboxPage.documentsCheckbox).toBeVisible();
    await expect(checkboxPage.downloadsCheckbox).toBeVisible();

    await checkboxPage.homeCheckbox.check();
    await expect(checkboxPage.homeCheckbox).toBeChecked();

    await checkboxPage.homeCheckbox.uncheck();
    await expect(checkboxPage.homeCheckbox).not.toBeChecked();
  });
});