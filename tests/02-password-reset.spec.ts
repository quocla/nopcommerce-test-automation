import { test, expect } from '../src/fixture/fixture';
import { TestDataGenerator } from '../src/utils/testDataGenerator';

test.describe('Password Reset Tests', () => {

  test('should navigate to forgot password page from login page @password-reset @smoke', async ({
    homePage,
    loginPage,
    forgotPasswordPage
  }) => {
    await homePage.goToLoginPage();
    await loginPage.assertLoginPageLoaded();

    await loginPage.clickForgotPasswordLink();
    await forgotPasswordPage.assertForgotPasswordPageLoaded();

    expect(await forgotPasswordPage.getCurrentUrl()).toContain('/passwordrecovery');
  });

  test('should successfully request password reset for existing user @password-reset @smoke', async ({
    homePage,
    loginPage,
    forgotPasswordPage,
    registeredUser
  }) => {
    await homePage.goToLoginPage();
    await loginPage.clickForgotPasswordLink();

    await forgotPasswordPage.requestPasswordRecovery(registeredUser.email);

    expect(await forgotPasswordPage.isRecoveryEmailSent()).toBe(true);

    const successMessage = await forgotPasswordPage.getSuccessMessage();
    expect(successMessage).toContain('Email with instructions has been sent');

    await forgotPasswordPage.takeScreenshot('password-reset-success');
  });

  test('should show validation error for empty email @password-reset @regression', async ({
    homePage,
    loginPage,
    forgotPasswordPage
  }) => {
    await homePage.goToLoginPage();
    await loginPage.clickForgotPasswordLink();

    await forgotPasswordPage.requestPasswordRecovery('');

    expect(await forgotPasswordPage.hasErrorMessage()).toBe(true);

    const errorMessage = await forgotPasswordPage.getErrorMessage();
    expect(errorMessage).toContain('Enter your email');
  });

  test('should show validation error for invalid email format @password-reset @regression', async ({
    homePage,
    loginPage,
    forgotPasswordPage
  }) => {
    await homePage.goToLoginPage();
    await loginPage.clickForgotPasswordLink();

    await forgotPasswordPage.requestPasswordRecovery('invalid-email-format');

    expect(await forgotPasswordPage.hasErrorMessage()).toBe(true);

    const errorMessage = await forgotPasswordPage.getErrorMessage();
    expect(errorMessage).toContain('Please enter a valid email address');
  });
}); 