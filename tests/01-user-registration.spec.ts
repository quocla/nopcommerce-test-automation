import { test, expect } from '../src/fixture/fixture';
import { TestDataGenerator } from '../src/utils/testDataGenerator';

test.describe('User Registration Tests', () => {

  test('should successfully register a new user with valid data @registration @smoke', async ({
    homePage,
    registerPage
  }) => {
    const userData = TestDataGenerator.generateUserData({
      newsletter: true
    });

    await homePage.goToRegisterPage();
    await registerPage.assertRegisterPageLoaded();

    await registerPage.registerUser(userData);

    expect(await registerPage.isRegistrationSuccessful()).toBe(true);

    const successMessage = await registerPage.getSuccessMessageText();
    expect(successMessage).toContain('registration completed');

    await registerPage.takeScreenshot('successful-registration');
  });

  test('should show validation error for empty email @registration @regression', async ({
    homePage,
    registerPage
  }) => {
    const invalidData = TestDataGenerator.generateInvalidUserData();

    await homePage.goToRegisterPage();
    await registerPage.registerUser(invalidData.emptyEmail);

    expect(await registerPage.hasValidationErrors()).toBe(true);

    const errors = await registerPage.getErrorMessages();
    expect(errors.some(error => error.includes('Email is required'))).toBe(true);
  });

  test('should show validation error for invalid email format @registration @regression', async ({
    homePage,
    registerPage
  }) => {
    const invalidData = TestDataGenerator.generateInvalidUserData();

    await homePage.goToRegisterPage();
    await registerPage.registerUser(invalidData.invalidEmail);

    expect(await registerPage.hasValidationErrors()).toBe(true);

    const errors = await registerPage.getErrorMessages();
    expect(errors.some(error => error.includes('Please enter a valid email address'))).toBe(true);
  });

  test('should show validation error for mismatched passwords @registration @regression', async ({
    homePage,
    registerPage
  }) => {
    const invalidData = TestDataGenerator.generateInvalidUserData();

    await homePage.goToRegisterPage();
    await registerPage.registerUser(invalidData.mismatchedPasswords);

    expect(await registerPage.hasValidationErrors()).toBe(true);

    const errors = await registerPage.getErrorMessages();
    expect(errors.some(error =>
      error.includes('The password and confirmation password do not match')
    )).toBe(true);
  });
}); 