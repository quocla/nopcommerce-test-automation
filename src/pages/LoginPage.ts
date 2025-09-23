import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Form elements
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;

  // Messages and validation
  private readonly errorMessage: Locator;
  private readonly validationSummary: Locator;

  // Page elements
  private readonly pageTitle: Locator;
  private readonly registerLink: Locator;

  // Customer info (after login)
  private readonly welcomeMessage: Locator;
  private readonly myAccountLink: Locator;

  constructor(page: Page) {
    super(page, '/login');

    // Form elements using specific locators
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.rememberMeCheckbox = page.locator('#RememberMe');
    this.loginButton = page.locator('.login-button');
    this.forgotPasswordLink = page.locator('a[href*="/passwordrecovery"]');

    // Messages and validation
    this.errorMessage = page.locator('.message-error');
    this.validationSummary = page.locator('.validation-summary-errors');

    // Page elements
    this.pageTitle = page.getByRole('heading', { name: 'Welcome, Please Sign In!' });
    this.registerLink = page.getByRole('link', { name: 'Register' });

    // Customer info (after login)
    this.welcomeMessage = page.locator('.topic-block-title h2');
    this.myAccountLink = page.locator('.ico-account').or(page.getByRole('link', { name: 'My account' }).first());
  }

  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);

    if (rememberMe) {
      const isChecked = await this.rememberMeCheckbox.isChecked();
      if (!isChecked) {
        await this.clickElement(this.rememberMeCheckbox);
      }
    }

    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async clickForgotPasswordLink(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
    await this.waitForPageLoad();
  }

  async goToRegisterPage(): Promise<void> {
    await this.clickElement(this.registerLink);
    await this.waitForPageLoad();
  }

  async isLoginSuccessful(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return !currentUrl.includes('/login') && await this.isElementVisible(this.myAccountLink);
  }

  async hasErrorMessage(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage) ||
           await this.isElementVisible(this.validationSummary);
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getTextContent(this.errorMessage);
    }

    if (await this.isElementVisible(this.validationSummary)) {
      return await this.getTextContent(this.validationSummary);
    }

    return '';
  }

  async assertLoginPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.loginButton);
    await this.assertPageUrl('/login');
  }
}
