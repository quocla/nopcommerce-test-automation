# nopCommerce Test Automation Framework

A Playwright + TypeScript test automation framework for nopCommerce e-commerce platform with Page Object Model architecture.

## ✨ Features

- **16 Test Cases** - Complete coverage of user registration, password reset, product search, and category exploration
- **Page Object Model** - Maintainable test architecture
- **Parallel Execution** - 4 workers for faster testing
- **Multiple Reports** - HTML, JSON, JUnit, and CTRF formats
- **CI/CD Ready** - GitHub Actions workflow included

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 7+

### Setup
```bash
git clone <repository-url>
cd nopcommerce-test-automation
npm install
npm run install:browsers
```

### Run Tests
```bash
# Run all tests
npm test

# Run specific tests
npm test -- tests/01-user-registration.spec.ts

# Run in headed mode
npm test -- --headed

# Generate reports
npm run report
```

## 📁 Project Structure

```
src/
├── pages/           # Page Object Models
├── fixture/         # Playwright fixtures
├── setup/           # Global test setup
└── utils/           # Utilities

tests/               # Test specifications
├── 01-user-registration.spec.ts
├── 02-password-reset.spec.ts
├── 03-product-search.spec.ts
└── 04-product-category.spec.ts
```

## 🧪 Test Coverage

- **User Registration** (4 tests) - Valid/invalid registration scenarios
- **Password Reset** (4 tests) - Forgot password flow validation
- **Product Search** (4 tests) - Search functionality and edge cases
- **Product Categories** (4 tests) - Category navigation and filtering

## 📊 Reports & Artifacts

Reports generated in:
- `playwright-report/` - HTML reports
- `test-results/` - JSON, XML, screenshots, videos
- `ctrf/` - CTRF format reports

## 🔧 Environment Configuration

Default test environment:
```env
BASE_URL="https://demo.nopcommerce.com"
USER_EMAIL="test.automation@example.com"
USER_PASSWORD="TestPass123!"
```

## 🛠️ Development

```bash
# Type checking
npm run type-check

# Code formatting
npm run lint
npm run format
```

---

**Built with Playwright + TypeScript** | **Ready for CI/CD** | **Comprehensive Test Coverage**
