import { faker } from '@faker-js/faker';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender?: 'male' | 'female';
  company?: string;
  newsletter?: boolean;
}

export interface SearchData {
  term: string;
  expectedResults: boolean;
  category?: string;
}

export interface ProductFilterData {
  priceRange?: {
    min: number;
    max: number;
  };
  manufacturer?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}

export class TestDataGenerator {
  private static getRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private static getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random user data for registration
   */
  static generateUserData(overrides?: Partial<UserData>): UserData {
    const timestamp = Date.now();
    const randomString = this.getRandomString(6);
    const password = 'Test123!@#'; // Default password for nopCommerce
    
    const userData: UserData = {
      firstName: `John${randomString}`,
      lastName: `Doe${this.getRandomNumber(1, 999)}`,
      email: `test_${randomString}_${timestamp}@automation-test.com`,
      password,
      confirmPassword: password,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      company: `Test Company ${this.getRandomNumber(1, 100)}`,
      newsletter: Math.random() > 0.5,
      ...overrides
    };

    return userData;
  }

  /**
   * Generate unique email with timestamp
   */
  static generateUniqueEmail(prefix?: string): string {
    const timestamp = Date.now();
    const randomString = this.getRandomString(6);
    const emailPrefix = prefix || 'user';
    return `${emailPrefix}_${randomString}_${timestamp}@automation-test.com`;
  }

  /**
   * Generate search terms for testing
   */
  static getSearchTerms(): string[] {
    return [
      'laptop',
      'computer',
      'phone',
      'samsung',
      'apple',
      'notebook',
      'desktop',
      'software',
      'camera',
      'headphones'
    ];
  }

  /**
   * Generate invalid user data for negative testing
   */
  static generateInvalidUserData(): {
    emptyEmail: UserData;
    invalidEmail: UserData;
    shortPassword: UserData;
    mismatchedPasswords: UserData;
    emptyRequiredFields: UserData;
  } {
    const baseData = this.generateUserData();

    return {
      emptyEmail: {
        ...baseData,
        email: ''
      },
      invalidEmail: {
        ...baseData,
        email: 'invalid-email-format'
      },
      shortPassword: {
        ...baseData,
        password: '123',
        confirmPassword: '123'
      },
      mismatchedPasswords: {
        ...baseData,
        confirmPassword: 'DifferentPassword123!'
      },
      emptyRequiredFields: {
        ...baseData,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    };
  }

  /**
   * Generate search test data
   */
  static generateSearchData(): SearchData[] {
    return [
      {
        term: 'laptop',
        expectedResults: true,
        category: 'Computers'
      },
      {
        term: 'samsung',
        expectedResults: true
      },
      {
        term: 'apple',
        expectedResults: true
      },
      {
        term: 'nokia',
        expectedResults: true
      },
      {
        term: 'nonexistentproduct12345',
        expectedResults: false
      },
      {
        term: 'computer',
        expectedResults: true,
        category: 'Computers'
      },
      {
        term: 'phone',
        expectedResults: true
      },
      {
        term: '',
        expectedResults: false
      }
    ];
  }

  /**
   * Generate product filter test data
   */
  static generateProductFilterData(): ProductFilterData[] {
    return [
      {
        priceRange: { min: 100, max: 500 },
        sortBy: 'price-asc'
      },
      {
        priceRange: { min: 500, max: 1000 },
        sortBy: 'price-desc'
      },
      {
        manufacturer: ['Apple', 'Samsung'],
        sortBy: 'name-asc'
      },
      {
        sortBy: 'name-desc'
      },
      {
        priceRange: { min: 0, max: 100 },
        manufacturer: ['HP'],
        sortBy: 'price-asc'
      }
    ];
  }

  /**
   * Generate existing user data for login tests
   */
  static getExistingUserData(): UserData {
    return {
      firstName: 'Test',
      lastName: 'User',
      email: process.env.USER_EMAIL || 'test.automation@example.com',
      password: process.env.USER_PASSWORD || 'TestPass123!',
      confirmPassword: process.env.USER_PASSWORD || 'TestPass123!'
    };
  }

  /**
   * Generate invalid login data
   */
  static generateInvalidLoginData(): {
    invalidEmail: { email: string; password: string };
    invalidPassword: { email: string; password: string };
    emptyFields: { email: string; password: string };
  } {
    const validEmail = this.generateUniqueEmail();
    const validPassword = 'Test123!@#';

    return {
      invalidEmail: {
        email: 'nonexistent@test.com',
        password: validPassword
      },
      invalidPassword: {
        email: validEmail,
        password: 'wrongpassword'
      },
      emptyFields: {
        email: '',
        password: ''
      }
    };
  }

  /**
   * Generate test passwords with different criteria
   */
  static getPasswordTestData(): {
    valid: string[];
    invalid: string[];
  } {
    return {
      valid: [
        'ValidPass123!',
        'AnotherGood1@',
        'SecureTest99#',
        'Test123!@#'
      ],
      invalid: [
        '123',           // Too short
        'password',      // No numbers or special chars
        'PASSWORD123',   // No lowercase
        'password123',   // No uppercase
        'Password',      // No numbers
        'Password123'    // No special characters
      ]
    };
  }

  /**
   * Generate random product names for search
   */
  static generateRandomProductNames(): string[] {
    const products = [
      'laptop', 'computer', 'mouse', 'keyboard', 'monitor',
      'phone', 'tablet', 'headphones', 'camera', 'speaker',
      'watch', 'charger', 'cable', 'case', 'bag'
    ];

    return faker.helpers.arrayElements(products, { min: 3, max: 8 });
  }

  /**
   * Generate date ranges for date of birth testing
   */
  static generateDateRanges(): {
    valid: { day: string; month: string; year: string }[];
    invalid: { day: string; month: string; year: string }[];
  } {
    const currentYear = new Date().getFullYear();
    
    return {
      valid: [
        { day: '15', month: '6', year: '1990' },
        { day: '1', month: '1', year: '1980' },
        { day: '31', month: '12', year: '2000' },
        { day: '29', month: '2', year: '2000' }, // Leap year
      ],
      invalid: [
        { day: '32', month: '1', year: '1990' },   // Invalid day
        { day: '29', month: '2', year: '1999' },   // Invalid leap year
        { day: '15', month: '13', year: '1990' },  // Invalid month
        { day: '15', month: '6', year: (currentYear + 1).toString() }, // Future year
      ]
    };
  }
} 