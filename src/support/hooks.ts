import { Before, After, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// Before hook for API tests
Before({ tags: '@api' }, async function (this: CustomWorld) {
  await this.init();
});

// After hook for API tests — attach request/response log on failure
After({ tags: '@api' }, async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.apiLogs.length > 0) {
    await this.attach(JSON.stringify(this.apiLogs, null, 2), 'application/json');
  }
  await this.cleanup();
});
