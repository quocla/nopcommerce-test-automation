# nopCommerce Test Automation Framework

A comprehensive test automation framework for nopCommerce e-commerce platform using Playwright and TypeScript, featuring Page Object Model (POM), parallel execution, and robust reporting.

## 🚀 Features

- **✅ 100% Test Coverage** - 16 automated test cases covering all critical user journeys
- **🎯 Page Object Model (POM)** - Maintainable and scalable test architecture
- **⚡ Parallel Execution** - 4 workers for faster test execution
- **📊 Comprehensive Reporting** - HTML, JSON, JUnit, and CTRF reports
- **🔄 CI/CD Ready** - GitHub Actions workflow included
- **🛡️ Environment Configuration** - Support for multiple test environments
- **📸 Artifacts Capture** - Screenshots, videos, and traces on failure
- **🔧 TypeScript** - Type-safe test development

## 📋 Test Coverage

### Core User Journeys
- **User Registration** (4 tests)
  - ✅ Successful registration with valid data
  - ✅ Empty email validation
  - ✅ Invalid email format validation
  - ✅ Password mismatch validation

- **Password Reset** (4 tests)
  - ✅ Navigation to forgot password page
  - ✅ Successful password reset request
  - ✅ Empty email validation
  - ✅ Invalid email format validation

- **Product Search** (4 tests)
  - ✅ Search with valid terms
  - ✅ Search for specific products (Apple)
  - ✅ Empty search handling
  - ✅ No results handling

- **Product Category Exploration** (4 tests)
  - ✅ Computer category and subcategories exploration
  - ✅ Notebooks subcategory with filters
  - ✅ Filter by manufacturer
  - ✅ Sort by price

## 🛠️ Prerequisites

- **Node.js** 16.x or higher
- **npm** 7.x or higher
- **Git** for version control

## 📦 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd TestAssignment
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Install Playwright Browsers
\`\`\`bash
npm run install:browsers
\`\`\`

### 4. Environment Configuration
The framework uses environment-specific configuration files:

- **Development**: \`.env.dev\`
- **Staging**: \`.env.staging\`

Current configuration includes:
\`\`\`env
BASE_URL="https://demo.nopcommerce.com"
USER_EMAIL="test.automation@example.com"
USER_PASSWORD="TestPass123!"
\`\`\`

## 🚀 Running Tests

### Quick Start
\`\`\`bash
# Run all tests
npm test

# Run tests in parallel (4 workers)
npm run test:parallel

# Run smoke tests only
npm run test:smoke
\`\`\`

### Specific Test Execution
\`\`\`bash
# Run specific test file
npm test -- tests/01-user-registration.spec.ts

# Run tests with specific tag
npm test -- --grep "@smoke"

# Run in headed mode (visible browser)
npm test -- --headed

# Run with custom workers
npm test -- --workers=2
\`\`\`

### Environment-Specific Runs
\`\`\`bash
# Run on staging environment
npm run staging:smoke

# Run on development environment (default)
npm run test:smoke
\`\`\`

### Browser-Specific Tests
\`\`\`bash
# Run on Chrome only (default)
npm run test:chrome

# Debug mode
npm run test:debug

# UI mode for interactive testing
npm run test:ui
\`\`\`

## 📊 Reports & Results

### Generate Reports
\`\`\`bash
# Generate and view HTML report
npm run report

# Open existing report
npm run report:open

# View test results in JSON format
cat test-results/results.json
\`\`\`

### Report Types Generated
- **HTML Report**: \`playwright-report/index.html\`
- **JSON Report**: \`test-results/results.json\`
- **JUnit Report**: \`test-results/results.xml\`
- **CTRF Report**: \`ctrf/ctrf-report.json\`

### Artifacts
Test artifacts are captured on failure:
- **Screenshots**: \`test-results/\`
- **Videos**: \`test-results/\`
- **Traces**: \`test-results/\` (viewable with \`npx playwright show-trace\`)

## 🏗️ Framework Architecture

### Directory Structure
\`\`\`
TestAssignment/
├── src/
│   ├── pages/           # Page Object Models
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   ├── RegisterPage.ts
│   │   ├── LoginPage.ts
│   │   ├── ForgotPasswordPage.ts
│   │   └── ProductListPage.ts
│   ├── fixture/         # Playwright Fixtures
│   │   └── fixture.ts
│   ├── setup/           # Global Test Setup
│   │   ├── globalSetup.ts
│   │   └── globalTeardown.ts
│   └── utils/           # Utilities
│       ├── env.ts
│       └── testDataGenerator.ts
├── tests/               # Test Specifications
│   ├── 01-user-registration.spec.ts
│   ├── 02-password-reset.spec.ts
│   ├── 03-product-search.spec.ts
│   └── 04-product-category.spec.ts
├── .github/workflows/   # CI/CD Configuration
└── test-results/        # Test Artifacts
\`\`\`

### Page Object Model
Each page extends \`BasePage\` and encapsulates:
- Element locators
- Page-specific actions
- Assertions and validations
- Screenshot utilities

### Fixtures
Custom Playwright fixtures provide:
- Pre-configured page objects
- User authentication
- Test data generation
- Environment setup

## 🔧 Development

### Type Checking
\`\`\`bash
npm run type-check
\`\`\`

### Code Quality
\`\`\`bash
# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
\`\`\`

### Adding New Tests
1. Create test file in \`tests/\` directory
2. Import required fixtures from \`../src/fixture/fixture\`
3. Use Page Objects for interactions
4. Add appropriate test tags (\`@smoke\`, \`@regression\`)

### Adding New Page Objects
1. Create new page class extending \`BasePage\`
2. Define element locators
3. Implement page-specific methods
4. Add to fixtures in \`src/fixture/fixture.ts\`

## 🚀 CI/CD

### GitHub Actions
The framework includes a complete CI/CD pipeline:

\`\`\`bash
# Workflow file: .github/workflows/playwright.yml
# Triggers: Push, Pull Request, Manual
# Features: 
# - Multi-environment testing
# - Parallel execution
# - Artifact storage
# - Report generation
\`\`\`

### Running in CI
\`\`\`bash
# The CI automatically:
# 1. Sets up Node.js environment
# 2. Installs dependencies
# 3. Runs tests in parallel
# 4. Generates reports
# 5. Stores artifacts
# 6. Publishes results
\`\`\`

## 🐛 Troubleshooting

### Common Issues

**Tests failing with timeout**
\`\`\`bash
# Increase timeout
npm test -- --timeout=90000
\`\`\`

**Browser not found**
\`\`\`bash
# Reinstall browsers
npm run install:browsers
\`\`\`

**Environment issues**
\`\`\`bash
# Check environment variables
echo $BASE_URL
cat .env.dev
\`\`\`

**Report generation errors**
\`\`\`bash
# Create required directories
mkdir -p ctrf playwright-report test-results
\`\`\`

### Debug Mode
\`\`\`bash
# Run with debug output
DEBUG=pw:api npm test

# Run in slowMo mode
npm test -- --headed --slowMo=1000

# Use Playwright Inspector
npm run test:debug
\`\`\`

## 📈 Performance

- **Parallel Execution**: 4 workers reduce execution time by ~75%
- **Smart Waiting**: Automatic waiting for elements and network
- **Efficient Locators**: Role-based and specific selectors
- **Optimized Screenshots**: Only on failure to save time

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Follow existing code patterns
4. Add tests for new functionality
5. Ensure all tests pass
6. Commit changes (\`git commit -m 'Add amazing feature'\`)
7. Push to branch (\`git push origin feature/amazing-feature\`)
8. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions and support:
- Create an issue in the repository
- Check existing documentation
- Review test logs and traces

## 🎯 Future Enhancements

- [ ] API testing integration
- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Cross-browser cloud testing
- [ ] Database validation
- [ ] Email testing integration

---

**Built with ❤️ using Playwright + TypeScript**
