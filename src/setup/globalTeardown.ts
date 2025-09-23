import { FullConfig } from "@playwright/test";

async function globalTeardown(config: FullConfig) {
    // Global cleanup after all tests
    console.log('🧹 Global teardown completed');
}

export default globalTeardown; 