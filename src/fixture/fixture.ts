// fixtures/customFixtures.ts
import { test as baseTest, Page } from '@playwright/test';
import ENV from '../utils/env';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ProductListPage } from '../pages/ProductListPage';
import { TestDataGenerator, UserData } from '../utils/testDataGenerator';

type UserInfo = {
  email: string;
  password: string;
  userData: UserData;
};

type Fixtures = {
  userInfo: UserInfo;
  homePage: HomePage;
  registerPage: RegisterPage;
  loginPage: LoginPage;
  forgotPasswordPage: ForgotPasswordPage;
  productListPage: ProductListPage;
  authenticatedPage: Page;
  registeredUser: UserInfo;
};

const test = baseTest.extend<Fixtures>({
  userInfo: async ({}, use) => {
    const userData = TestDataGenerator.generateUserData();
    await use({
      email: userData.email,
      password: userData.password,
      userData
    });
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  forgotPasswordPage: async ({ page }, use) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await use(forgotPasswordPage);
  },

  productListPage: async ({ page }, use) => {
    const productListPage = new ProductListPage(page);
    await use(productListPage);
  },

  registeredUser: async ({ page }, use) => {
    // Use the existing user credentials from environment/TestDataGenerator
    const userData = TestDataGenerator.getExistingUserData();

    // Simply provide the user data - tests will handle registration/login as needed
    await use({
      email: userData.email,
      password: userData.password,
      userData
    });
  },

  authenticatedPage: async ({ page, registeredUser }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(registeredUser.email, registeredUser.password);

    const isLoggedIn = await loginPage.isLoginSuccessful();
    if (!isLoggedIn) {
      throw new Error('User login failed during fixture setup');
    }

    await use(page);
  },
});

export { test };
export { expect } from '@playwright/test';
