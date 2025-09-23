import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Header elements
  private readonly logo: Locator;
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly registerLink: Locator;
  private readonly loginLink: Locator;
  private readonly myAccountLink: Locator;
  private readonly cartLink: Locator;
  private readonly wishlistLink: Locator;

  // Navigation menu
  private readonly computersMenu: Locator;
  private readonly electronicsMenu: Locator;
  private readonly apparelMenu: Locator;
  private readonly digitalDownloadsMenu: Locator;
  private readonly booksMenu: Locator;
  private readonly jewelryMenu: Locator;
  private readonly giftCardsMenu: Locator;

  // Computers submenu
  private readonly desktopsSubmenu: Locator;
  private readonly notebooksSubmenu: Locator;
  private readonly softwareSubmenu: Locator;

  // Product elements
  private readonly productItems: Locator;
  private readonly productTitles: Locator;
  private readonly productPrices: Locator;
  private readonly addToCartButtons: Locator;

  // Messages
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page, '/');

    // Header elements - using role-based locators from MCP exploration
    this.logo = page.getByRole('link', { name: 'nopCommerce demo store' });
    this.searchBox = page.getByRole('textbox', { name: 'Search store' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.myAccountLink = page.locator('.ico-account').or(page.getByRole('link', { name: 'My account' }).first());
    this.cartLink = page.getByRole('link', { name: /Shopping cart/ });
    this.wishlistLink = page.getByRole('link', { name: /Wishlist/ });

    // Navigation menu - using role-based locators
    this.computersMenu = page.getByRole('link', { name: 'Computers' }).first();
    this.electronicsMenu = page.getByRole('link', { name: 'Electronics' }).first();
    this.apparelMenu = page.getByRole('link', { name: 'Apparel' }).first();
    this.digitalDownloadsMenu = page.getByRole('link', { name: 'Digital downloads' }).first();
    this.booksMenu = page.getByRole('link', { name: 'Books' }).first();
    this.jewelryMenu = page.getByRole('link', { name: 'Jewelry' }).first();
    this.giftCardsMenu = page.getByRole('link', { name: 'Gift Cards' }).first();

    // Computers submenu - these will be visible when hovering over computers
    this.desktopsSubmenu = page.getByRole('link', { name: 'Desktops' });
    this.notebooksSubmenu = page.getByRole('link', { name: 'Notebooks' });
    this.softwareSubmenu = page.getByRole('link', { name: 'Software' });

    // Product elements - using heading and button roles
    this.productItems = page.locator('.product-item');
    this.productTitles = page.getByRole('heading', { level: 2 }).getByRole('link');
    this.productPrices = page.locator('.price');
    this.addToCartButtons = page.getByRole('button', { name: 'Add to cart' });

    // Messages
    this.successMessage = page.locator('.bar-notification.success');
    this.errorMessage = page.locator('.bar-notification.error');
  }

  async searchForProduct(searchTerm: string): Promise<void> {
    await this.fillInput(this.searchBox, searchTerm);
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  async goToRegisterPage(): Promise<void> {
    await this.clickElement(this.registerLink);
    await this.waitForPageLoad();
  }

  async goToLoginPage(): Promise<void> {
    await this.clickElement(this.loginLink);
    await this.waitForPageLoad();
  }

  async goToComputersCategory(): Promise<void> {
    await this.clickElement(this.computersMenu);
    await this.waitForPageLoad();
  }

  async goToNotebooksCategory(): Promise<void> {
    // First go to computers to make submenu visible
    await this.goToComputersCategory();
    // Then click on notebooks in the subcategory section
    await this.clickElement(this.notebooksSubmenu);
    await this.waitForPageLoad();
  }

  async goToDesktopsCategory(): Promise<void> {
    // First go to computers to make submenu visible
    await this.goToComputersCategory();
    // Then click on desktops in the subcategory section
    await this.clickElement(this.desktopsSubmenu);
    await this.waitForPageLoad();
  }

  async goToElectronicsCategory(): Promise<void> {
    await this.clickElement(this.electronicsMenu);
    await this.waitForPageLoad();
  }

  async goToApparelCategory(): Promise<void> {
    await this.clickElement(this.apparelMenu);
    await this.waitForPageLoad();
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.myAccountLink);
  }

  async logout(): Promise<void> {
    // nopCommerce doesn't have a logout link in the header when logged in
    // User needs to go to My Account page to logout
    if (await this.isUserLoggedIn()) {
      await this.clickElement(this.myAccountLink);
      await this.waitForPageLoad();
      // Look for logout option on account page
      const logoutLink = this.page.getByRole('link', { name: 'Logout' });
      if (await logoutLink.isVisible()) {
        await this.clickElement(logoutLink);
        await this.waitForPageLoad();
      }
    }
  }

  async assertHomePageLoaded(): Promise<void> {
    await this.assertElementVisible(this.logo);
    await this.assertElementVisible(this.searchBox);
    await this.assertPageUrl('demo.nopcommerce.com');
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async getProductTitles(): Promise<string[]> {
    const count = await this.productTitles.count();
    if (count > 0) {
      return await this.productTitles.allTextContents();
    }
    return [];
  }

  async clickFirstProduct(): Promise<void> {
    await this.clickElement(this.productTitles.first());
    await this.waitForPageLoad();
  }
}

