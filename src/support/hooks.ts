import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// Before hook for API tests
Before({ tags: '@api' }, async function (this: CustomWorld) {
  await this.init();
});

// After hook for API tests
After({ tags: '@api' }, async function (this: CustomWorld) {
  await this.cleanup();
});
