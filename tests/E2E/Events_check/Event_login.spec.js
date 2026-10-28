import { test, expect } from '@playwright/test';

test('Login Event', async ({ page }) => {
    await page.goto('https://aievents.brandingnext.com/login');
    await page.getByPlaceholder('Email Address').fill('sreethin.babu@toobler.com');
    await page.getByPlaceholder('Password').fill('password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('https://aievents.brandingnext.com/lobby');

}
);





