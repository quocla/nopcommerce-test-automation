import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  // Form elements - using more specific locators to avoid strict mode violations
  private readonly genderMaleRadio: Locator;
  private readonly genderFemaleRadio: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly companyInput: Locator;
  private readonly newsletterCheckbox: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly registerButton: Locator;

  // Messages and validation - updated to use field validation errors
  private readonly successMessage: Locator;
  private readonly fieldValidationErrors: Locator;

  // Page elements
  private readonly pageTitle: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    super(page, '/register');

    // Form elements using more specific locators to avoid strict mode violations
    this.genderMaleRadio = page.locator('#gender-male');
    this.genderFemaleRadio = page.locator('#gender-female');
    this.firstNameInput = page.locator('#FirstName');
    this.lastNameInput = page.locator('#LastName');
    this.emailInput = page.locator('#Email');
    this.companyInput = page.locator('#Company');
    this.newsletterCheckbox = page.locator('#Newsletter');
    this.passwordInput = page.locator('#Password');
    this.confirmPasswordInput = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('#register-button');

    // Messages and validation - field validation errors appear inline after fields
    this.successMessage = page.getByText('Your registration completed');
    this.fieldValidationErrors = page.locator('.field-validation-error, [data-valmsg-for]');

    // Page elements
    this.pageTitle = page.getByRole('heading', { name: 'Register' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async registerUser(userData: {
    gender?: 'male' | 'female';
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    company?: string;
    newsletter?: boolean;
  }): Promise<void> {
    if (userData.gender === 'male') {
      await this.clickElement(this.genderMaleRadio);
    } else if (userData.gender === 'female') {
      await this.clickElement(this.genderFemaleRadio);
    }

    await this.fillInput(this.firstNameInput, userData.firstName);
    await this.fillInput(this.lastNameInput, userData.lastName);
    await this.fillInput(this.emailInput, userData.email);
    await this.fillInput(this.passwordInput, userData.password);
    await this.fillInput(this.confirmPasswordInput, userData.confirmPassword);

    if (userData.company) {
      await this.fillInput(this.companyInput, userData.company);
    }

    if (userData.newsletter !== undefined) {
      const isChecked = await this.newsletterCheckbox.isChecked();
      if ((userData.newsletter && !isChecked) || (!userData.newsletter && isChecked)) {
        await this.clickElement(this.newsletterCheckbox);
      }
    }

    await this.clickElement(this.registerButton);
    await this.waitForPageLoad();
  }

  async clickContinueButton(): Promise<void> {
    if (await this.isElementVisible(this.continueButton)) {
      await this.clickElement(this.continueButton);
      await this.waitForPageLoad();
    }
  }

  async isRegistrationSuccessful(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  async getSuccessMessageText(): Promise<string> {
    return await this.getTextContent(this.successMessage);
  }

  async hasValidationErrors(): Promise<boolean> {
    // Check for both inline field validation errors and any text-based error messages
    const hasFieldErrors = await this.fieldValidationErrors.count() > 0;
    const hasInlineErrors = await this.page.getByText('Email is required').isVisible() ||
                           await this.page.getByText('Please enter a valid email address').isVisible() ||
                           await this.page.getByText('The password and confirmation password do not match').isVisible();
    
    return hasFieldErrors || hasInlineErrors;
  }

  async getErrorMessages(): Promise<string[]> {
    const errors: string[] = [];

    // Get field validation errors
    if (await this.fieldValidationErrors.count() > 0) {
      const errorTexts = await this.fieldValidationErrors.allTextContents();
      errors.push(...errorTexts);
    }

    // Get text-based error messages that appear inline
    const possibleErrors = [
      'Email is required',
      'Please enter a valid email address',
      'The password and confirmation password do not match'
    ];

    for (const errorText of possibleErrors) {
      if (await this.page.getByText(errorText).isVisible()) {
        errors.push(errorText);
      }
    }

    return errors.filter(error => error.trim().length > 0);
  }

  async assertRegisterPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.pageTitle);
    await this.assertElementVisible(this.registerButton);
    await this.assertPageUrl('/register');
  }
} 