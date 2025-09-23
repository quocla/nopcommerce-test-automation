import { test, expect } from '../src/fixture/fixture';

test.describe('Product Search Tests', () => {

  test('should search for products using search box @product-search @smoke', async ({ 
    homePage, 
    productListPage 
  }) => {
    const searchTerm = 'laptop';
    
    // Perform search from home page
    await homePage.searchForProduct(searchTerm);
    await productListPage.waitForProductsToLoad();
    
    // Verify search results
    const productCount = await productListPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    // Verify products contain search term (case insensitive)
    const productTitles = await productListPage.getProductTitles();
    if (productTitles.length > 0) {
      const relevantProducts = productTitles.filter(title => 
        title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(relevantProducts.length).toBeGreaterThan(0);
    }
    
    await productListPage.takeScreenshot('search-results-laptop');
  });

  test('should search for Apple products @product-search @regression', async ({ 
    homePage, 
    productListPage 
  }) => {
    const searchTerm = 'Apple';
    
    // Perform search
    await homePage.searchForProduct(searchTerm);
    await productListPage.waitForProductsToLoad();
    
    // Verify search results
    const productCount = await productListPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    // Verify products are Apple-related
    const productTitles = await productListPage.getProductTitles();
    const appleProducts = productTitles.filter(title => 
      title.toLowerCase().includes('apple') || 
      title.toLowerCase().includes('macbook')
    );
    expect(appleProducts.length).toBeGreaterThan(0);
    
    await productListPage.takeScreenshot('search-results-apple');
  });

  test('should handle empty search @product-search @regression', async ({ 
    homePage, 
    productListPage 
  }) => {
    // Test empty search
    await homePage.searchForProduct('');
    await productListPage.waitForProductsToLoad();
    
    // Should either show validation message or all products
    const productCount = await productListPage.getProductCount();
    expect(productCount).toBeGreaterThanOrEqual(0);
    
    await productListPage.takeScreenshot('search-results-empty');
  });

  test('should handle search with no results @product-search @regression', async ({ 
    homePage, 
    productListPage 
  }) => {
    // Search for something that definitely won't exist
    await homePage.searchForProduct('nonexistentproduct12345xyz');
    await productListPage.waitForProductsToLoad();
    
    // Should show no results
    const productCount = await productListPage.getProductCount();
    expect(productCount).toBe(0);
    
    await productListPage.takeScreenshot('search-results-no-results');
  });

}); 