import { test, expect } from '@playwright/test';
import { Login } from '../../pages/Events/login.page';

// test('Login Event', async ({ page }) => {
//     await page.goto('https://aievents.brandingnext.com/login');
//     await page.getByPlaceholder('Email Address').fill('sreethin.babu@toobler.com');
//     await page.getByPlaceholder('Password').fill('password');
//     await page.click('button[type="submit"]');
//     await expect(page).toHaveURL('https://aievents.brandingnext.com/lobby');

test.describe.serial('Login page tests', () => {
    test('TC_01 : Verify the user is able to access the login page', async ({ page }) =>
        {
        const login = new Login(page);
 
        await test.step('Access the login page', async () => {
        await login.loginURL();
        });
 
        await test.step('Verify the login page', async () => {
            await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
        });
        
        });

    test('TC_02 : Verify the user is able to login page', async ({ page }) =>
    {


    });

    test('TC_03 : Verify the Invalid login credentials', async ({ page }) =>
    {

    });

    test('TC_04 : Verify the forgot password functionality', async ({ page }) =>
    {


    });



}
);





