import { Before, After, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

Before({ tags: '@api' }, async function (this: CustomWorld) {
  await this.init();
});

After({ tags: '@api' }, async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.apiLogs.length > 0) {
    await this.attach(JSON.stringify(this.apiLogs, null, 2), 'application/json');
  }
  await this.cleanup();
});
