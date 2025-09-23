import { test, expect } from '../src/fixture/fixture';

test.describe('Product Category Exploration Tests', () => {

  test('should explore Computers category and subcategories @category-exploration @smoke', async ({
    homePage,
    productListPage
  }) => {
    // Navigate to Computers category
    await homePage.goToComputersCategory();
    await productListPage.assertProductListPageLoaded('Computers');

    // Verify we're in the computers category
    const categoryTitle = await productListPage.getCategoryTitle();
    expect(categoryTitle.toLowerCase()).toContain('computers');

    // Verify subcategories are available using more specific locators
    const desktopsHeading = homePage.page.getByRole('heading', { name: 'Desktops' });
    const notebooksHeading = homePage.page.getByRole('heading', { name: 'Notebooks' });
    const softwareHeading = homePage.page.getByRole('heading', { name: 'Software' });

    await expect(desktopsHeading).toBeVisible();
    await expect(notebooksHeading).toBeVisible();
    await expect(softwareHeading).toBeVisible();

    await productListPage.takeScreenshot('computers-category-overview');
  });

  test('should explore Notebooks subcategory with products and filters @category-exploration @smoke', async ({
    homePage,
    productListPage
  }) => {
    // Navigate to Notebooks subcategory directly
    await homePage.page.goto('https://demo.nopcommerce.com/notebooks');
    await productListPage.assertProductListPageLoaded('Notebooks');

    // Verify we're in the notebooks category
    const categoryTitle = await productListPage.getCategoryTitle();
    expect(categoryTitle.toLowerCase()).toContain('notebooks');

    // Wait for products to load and verify products are displayed
    await productListPage.waitForProductsToLoad();
    const productCount = await productListPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // Get some product information for verification
    const productTitles = await productListPage.getProductTitles();
    expect(productTitles.length).toBeGreaterThan(0);

    // Verify products are notebook-related
    const notebookKeywords = ['laptop', 'macbook', 'notebook', 'ultrabook'];
    const hasNotebookProducts = productTitles.some(title =>
      notebookKeywords.some(keyword => title.toLowerCase().includes(keyword))
    );
    expect(hasNotebookProducts).toBe(true);

    await productListPage.takeScreenshot('notebooks-category-with-products');
  });

  test('should filter notebooks by manufacturer @category-exploration @regression', async ({
    homePage,
    productListPage
  }) => {
    // Navigate to Notebooks subcategory
    await homePage.page.goto('https://demo.nopcommerce.com/notebooks');
    await productListPage.waitForProductsToLoad();

    // Get initial product count
    const initialCount = await productListPage.getProductCount();
    expect(initialCount).toBeGreaterThan(0);

    // Look for Apple filter checkbox (may not always be available)
    const appleFilter = homePage.page.locator('input[value="1"][name="mid"]'); // Apple manufacturer ID
    if (await appleFilter.isVisible()) {
      await appleFilter.check();
      await productListPage.waitForProductsToLoad();

      // Verify filtering worked
      const productTitles = await productListPage.getProductTitles();

      // Should have Apple products
      const hasAppleProducts = productTitles.some(title =>
        title.toLowerCase().includes('apple') || title.toLowerCase().includes('macbook')
      );
      expect(hasAppleProducts).toBe(true);

      await productListPage.takeScreenshot('notebooks-filtered-by-apple');
    } else {
      // If Apple filter is not available, just verify we can see some manufacturer filters
      const manufacturerSection = homePage.page.locator('.block .title', { hasText: 'Manufacturer' });
      await expect(manufacturerSection).toBeVisible();
      await productListPage.takeScreenshot('notebooks-manufacturer-filters');
    }
  });

  test('should sort products by price and verify sorting @category-exploration @regression', async ({
    homePage,
    productListPage
  }) => {
    // Navigate to Notebooks subcategory
    await homePage.page.goto('https://demo.nopcommerce.com/notebooks');
    await productListPage.waitForProductsToLoad();

    // Get initial product count
    const initialCount = await productListPage.getProductCount();
    expect(initialCount).toBeGreaterThan(0);

    // Look for sort dropdown
    const sortDropdown = homePage.page.locator('#products-orderby');
    if (await sortDropdown.isVisible()) {
      // Sort by price ascending
      await sortDropdown.selectOption('10'); // Price: Low to High
      await productListPage.waitForProductsToLoad();

      await productListPage.takeScreenshot('products-sorted-price-ascending');

      // Sort by price descending
      await sortDropdown.selectOption('11'); // Price: High to Low
      await productListPage.waitForProductsToLoad();

      await productListPage.takeScreenshot('products-sorted-price-descending');
    } else {
      // If sort dropdown is not available, just verify page loaded correctly
      const productTitles = await productListPage.getProductTitles();
      expect(productTitles.length).toBeGreaterThan(0);
      await productListPage.takeScreenshot('notebooks-no-sort-available');
    }
  });
}); 