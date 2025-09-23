import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductListPage extends BasePage {
  // Sort elements
  private readonly sortDropdown: Locator;
  
  // Display options
  private readonly viewAsList: Locator;
  private readonly viewAsGrid: Locator;
  private readonly pageSize: Locator;
  
  // Product elements
  private readonly productItems: Locator;
  private readonly productTitles: Locator;
  private readonly productPrices: Locator;
  private readonly productImages: Locator;
  private readonly addToCartButtons: Locator;
  
  // Filter elements
  private readonly priceFilter: Locator;
  private readonly manufacturerFilter: Locator;
  private readonly specificationFilter: Locator;
  
  // Pagination
  private readonly pager: Locator;
  private readonly previousPage: Locator;
  private readonly nextPage: Locator;
  private readonly currentPage: Locator;
  
  // Category info
  private readonly categoryTitle: Locator;
  private readonly breadcrumb: Locator;

  constructor(page: Page) {
    super(page);
    
    // Sort elements
    this.sortDropdown = page.locator('#products-orderby');
    
    // Display options
    this.viewAsList = page.locator('.viewmode-icon.list');
    this.viewAsGrid = page.locator('.viewmode-icon.grid');
    this.pageSize = page.locator('#products-pagesize');
    
    // Product elements
    this.productItems = page.locator('.product-item');
    this.productTitles = page.locator('.product-title a');
    this.productPrices = page.locator('.price');
    this.productImages = page.locator('.product-box .picture img');
    this.addToCartButtons = page.locator('.add-to-cart-button');
    
    // Filter elements
    this.priceFilter = page.locator('.price-range-filter');
    this.manufacturerFilter = page.locator('.manufacturer-filter');
    this.specificationFilter = page.locator('.specification-filter');
    
    // Pagination
    this.pager = page.locator('.pager');
    this.previousPage = page.locator('.previous-page');
    this.nextPage = page.locator('.next-page');
    this.currentPage = page.locator('.current-page');
    
    // Category info
    this.categoryTitle = page.locator('.page-title h1');
    this.breadcrumb = page.locator('.breadcrumb');
  }

  /**
   * Sort products by option
   */
  async sortBy(sortOption: 'position' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'created-asc' | 'created-desc'): Promise<void> {
    const sortValues: { [key: string]: string } = {
      'position': '0',
      'name-asc': '5',
      'name-desc': '6',
      'price-asc': '10',
      'price-desc': '11',
      'created-asc': '15',
      'created-desc': '16'
    };
    
    const sortValue = sortValues[sortOption];
    if (sortValue) {
      await this.selectOption(this.sortDropdown, sortValue);
      await this.waitForPageLoad();
    }
  }

  /**
   * Filter by manufacturer
   */
  async filterByManufacturer(manufacturer: string): Promise<void> {
    const manufacturerCheckbox = this.page.locator(`.manufacturer-filter input[value="${manufacturer}"], .manufacturer-filter label:has-text("${manufacturer}") input`);
    if (await manufacturerCheckbox.isVisible()) {
      await this.clickElement(manufacturerCheckbox);
      await this.waitForPageLoad();
    }
  }

  /**
   * Filter by price range using sliders or inputs
   */
  async filterByPriceRange(minPrice: number, maxPrice: number): Promise<void> {
    // Try to find price range inputs
    const priceFromInput = this.page.locator('#price-from');
    const priceToInput = this.page.locator('#price-to');
    
    if (await priceFromInput.isVisible() && await priceToInput.isVisible()) {
      await this.fillInput(priceFromInput, minPrice.toString());
      await this.fillInput(priceToInput, maxPrice.toString());
      
      // Look for filter button
      const filterButton = this.page.locator('.price-range-filter .button-2, .filter-button');
      if (await filterButton.isVisible()) {
        await this.clickElement(filterButton);
        await this.waitForPageLoad();
      }
    }
  }

  /**
   * Change page size
   */
  async changePageSize(size: '4' | '8' | '12'): Promise<void> {
    await this.selectOption(this.pageSize, size);
    await this.waitForPageLoad();
  }

  /**
   * Switch to list view
   */
  async switchToListView(): Promise<void> {
    if (await this.viewAsList.isVisible()) {
      await this.clickElement(this.viewAsList);
      await this.waitForPageLoad();
    }
  }

  /**
   * Switch to grid view
   */
  async switchToGridView(): Promise<void> {
    if (await this.viewAsGrid.isVisible()) {
      await this.clickElement(this.viewAsGrid);
      await this.waitForPageLoad();
    }
  }

  /**
   * Get total product count
   */
  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  /**
   * Get all product titles
   */
  async getProductTitles(): Promise<string[]> {
    const count = await this.productTitles.count();
    if (count > 0) {
      return await this.productTitles.allTextContents();
    }
    return [];
  }

  /**
   * Get all product prices
   */
  async getProductPrices(): Promise<string[]> {
    const count = await this.productPrices.count();
    if (count > 0) {
      return await this.productPrices.allTextContents();
    }
    return [];
  }

  /**
   * Get product prices as numbers (removing currency symbols)
   */
  async getProductPricesAsNumbers(): Promise<number[]> {
    const priceTexts = await this.getProductPrices();
    return priceTexts.map(price => {
      // Remove currency symbols and convert to number
      const numericPrice = price.replace(/[^0-9.]/g, '');
      return parseFloat(numericPrice) || 0;
    });
  }

  /**
   * Click on product by index
   */
  async clickProductByIndex(index: number): Promise<void> {
    const product = this.productTitles.nth(index);
    await this.clickElement(product);
    await this.waitForPageLoad();
  }

  /**
   * Click on product by title
   */
  async clickProductByTitle(title: string): Promise<void> {
    const product = this.page.locator(`.product-title a:has-text("${title}")`);
    await this.clickElement(product);
    await this.waitForPageLoad();
  }

  /**
   * Add product to cart by index
   */
  async addProductToCartByIndex(index: number): Promise<void> {
    const addToCartButton = this.addToCartButtons.nth(index);
    if (await addToCartButton.isVisible()) {
      await this.clickElement(addToCartButton);
      await this.waitForPageLoad();
    }
  }

  /**
   * Go to next page
   */
  async goToNextPage(): Promise<void> {
    if (await this.nextPage.isVisible()) {
      await this.clickElement(this.nextPage);
      await this.waitForPageLoad();
    }
  }

  /**
   * Go to previous page
   */
  async goToPreviousPage(): Promise<void> {
    if (await this.previousPage.isVisible()) {
      await this.clickElement(this.previousPage);
      await this.waitForPageLoad();
    }
  }

  /**
   * Get current page number
   */
  async getCurrentPageNumber(): Promise<number> {
    if (await this.currentPage.isVisible()) {
      const currentPageText = await this.getTextContent(this.currentPage);
      return parseInt(currentPageText) || 1;
    }
    return 1;
  }

  /**
   * Verify products are sorted by price (ascending)
   */
  async verifyProductsSortedByPriceAscending(): Promise<boolean> {
    const prices = await this.getProductPricesAsNumbers();
    
    for (let i = 1; i < prices.length; i++) {
      if ((prices[i] ?? 0) < (prices[i - 1] ?? 0)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Verify products are sorted by price (descending)
   */
  async verifyProductsSortedByPriceDescending(): Promise<boolean> {
    const prices = await this.getProductPricesAsNumbers();
    
    for (let i = 1; i < prices.length; i++) {
      if ((prices[i] ?? 0) > (prices[i - 1] ?? 0)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get category title
   */
  async getCategoryTitle(): Promise<string> {
    return await this.getTextContent(this.categoryTitle);
  }

  /**
   * Assert product list page is loaded
   */
  async assertProductListPageLoaded(expectedCategory?: string): Promise<void> {
    await this.assertElementVisible(this.categoryTitle);
    
    if (expectedCategory) {
      const title = await this.getCategoryTitle();
      if (!title.toLowerCase().includes(expectedCategory.toLowerCase())) {
        throw new Error(`Expected category "${expectedCategory}" but got "${title}"`);
      }
    }
  }

  /**
   * Wait for products to load
   */
  async waitForProductsToLoad(): Promise<void> {
    // Wait for at least one product or no products message
    await this.page.waitForFunction(() => {
      const products = document.querySelectorAll('.product-item');
      const noProducts = document.querySelector('.no-result');
      return products.length > 0 || noProducts;
    }, { timeout: 10000 });
  }
} 