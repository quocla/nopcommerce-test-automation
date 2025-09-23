import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ForgotPasswordPage extends BasePage {
  // Form elements
  private readonly emailInput: Locator;
  private readonly recoverButton: Locator;

  // Messages - updated based on MCP exploration
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;
  private readonly validationError: Locator;

  // Page elements
  private readonly pageTitle: Locator;
  private readonly backToLoginLink: Locator;

  constructor(page: Page) {
    super(page, '/passwordrecovery');

    // Form elements using specific locators
    this.emailInput = page.getByRole('textbox', { name: 'Your email address:' });
    this.recoverButton = page.getByRole('button', { name: 'Recover' });

    // Messages - use text-based locator for success message
    this.successMessage = page.getByText('Email with instructions has been sent to you.');
    this.errorMessage = page.locator('.message-error');
    this.validationError = page.locator('.field-validation-error');

    // Page elements
    this.pageTitle = page.getByRole('heading', { name: 'Password recovery' });
    this.backToLoginLink = page.getByRole('link', { name: 'Login' });
  }

  async requestPasswordRecovery(email: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.clickElement(this.recoverButton);
    await this.waitForPageLoad();
  }

  async goBackToLogin(): Promise<void> {
    if (await this.isElementVisible(this.backToLoginLink)) {
      await this.clickElement(this.backToLoginLink);
      await this.waitForPageLoad();
    }
  }

  async isRecoveryEmailSent(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getTextContent(this.successMessage);
  }

  async hasErrorMessage(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage) ||
           await this.isElementVisible(this.validationError);
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getTextContent(this.errorMessage);
    }

    if (await this.isElementVisible(this.validationError)) {
      return await this.getTextContent(this.validationError);
    }

    return '';
  }

  async assertForgotPasswordPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.pageTitle);
    await this.assertElementVisible(this.recoverButton);
    await this.assertPageUrl('/passwordrecovery');
  }
} 