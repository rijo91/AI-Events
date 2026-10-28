const { test, expect } = require('@playwright/test');

const signInUrl =
  'https://accounts.google.com/?service=mail&continue=https://mail.google.com/mail/';

async function openSignIn(page) {
  await page.goto(signInUrl);
  await expect(page.getByLabel(/email or phone/i)).toBeVisible();
}

async function continueWithEmail(page, email) {
  await page.getByLabel(/email or phone/i).fill(email);
  await page.getByRole('button', { name: /next/i }).click();
}

test('Verify Google homepage title', async ({ page }) => {
  await page.goto('https://www.google.com/');
  await expect(page).toHaveTitle('Google');
});

test('Rejects an empty email field', async ({ page }) => {
  await openSignIn(page);
  await page.getByRole('button', { name: /next/i }).click();
  await expect(page.getByText(/enter an email or phone number/i)).toBeVisible();
});

test('Rejects an invalid email format', async ({ page }) => {
  await openSignIn(page);
  await continueWithEmail(page, 'not-an-email');
  await expect(page.getByText(/enter a valid email or phone number/i)).toBeVisible();
});

test('Shows an error for an account that does not exist', async ({ page }) => {
  await openSignIn(page);
  await continueWithEmail(page, 'gmail-login-test-account-that-does-not-exist@example.com');
  await expect(page.getByText(/couldn't find your google account/i)).toBeVisible();
});

test('Signs in with a valid test account', async ({ page }) => {
  test.skip(
    !process.env.GMAIL_TEST_EMAIL || !process.env.GMAIL_TEST_PASSWORD,
    'Set GMAIL_TEST_EMAIL and GMAIL_TEST_PASSWORD to use a dedicated test account.',
  );

  await openSignIn(page);
  await continueWithEmail(page, process.env.GMAIL_TEST_EMAIL);
  await page.getByLabel(/enter your password/i).fill(process.env.GMAIL_TEST_PASSWORD);
  await page.getByRole('button', { name: /next/i }).click();
  await expect(page).toHaveURL(/mail\.google\.com/);
});

test('Rejects an incorrect password for a test account', async ({ page }) => {
  test.skip(
    !process.env.GMAIL_TEST_EMAIL,
    'Set GMAIL_TEST_EMAIL to use a dedicated test account.',
  );

  await openSignIn(page);
  await continueWithEmail(page, process.env.GMAIL_TEST_EMAIL);
  await page.getByLabel(/enter your password/i).fill('IntentionallyIncorrectPassword123!');
  await page.getByRole('button', { name: /next/i }).click();
  await expect(page.getByText(/wrong password|incorrect password|couldn't sign you in/i)).toBeVisible();
});

test('Prompts for second-step verification on a two-step test account', async ({ page }) => {
  test.skip(
    !process.env.GMAIL_2SV_EMAIL || !process.env.GMAIL_2SV_PASSWORD,
    'Set GMAIL_2SV_EMAIL and GMAIL_2SV_PASSWORD for an account with two-step verification enabled.',
  );

  await openSignIn(page);
  await continueWithEmail(page, process.env.GMAIL_2SV_EMAIL);
  await page.getByLabel(/enter your password/i).fill(process.env.GMAIL_2SV_PASSWORD);
  await page.getByRole('button', { name: /next/i }).click();
  await expect(page.getByText(/2-step verification|verify it's you|check your phone/i)).toBeVisible();
});

test('Starts account recovery from the forgot-password flow', async ({ page }) => {
  test.skip(
    !process.env.GMAIL_TEST_EMAIL,
    'Set GMAIL_TEST_EMAIL to use a dedicated test account.',
  );

  await openSignIn(page);
  await continueWithEmail(page, process.env.GMAIL_TEST_EMAIL);
  await page.getByRole('link', { name: /forgot password/i }).click();
  await expect(page).toHaveURL(/signin\/v2\/challenge|signin\/recovery/i);
});
