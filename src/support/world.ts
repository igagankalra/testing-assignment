import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { request, APIRequestContext } from '@playwright/test';
import { PetApiClient, ApiLogEntry } from '@api/PetApiClient';
import { Pet } from '../types/petstore.types';
import 'dotenv/config';

// Trailing slash is required: Playwright resolves request paths via the URL
// spec, so a base without trailing slash drops its last segment (e.g. /v2).
const DEFAULT_API_BASE_URL = 'https://petstore.swagger.io/v2/';

// Shared state across Cucumber steps in a scenario
export class CustomWorld extends World {
  apiContext!: APIRequestContext;
  client!: PetApiClient;
  apiLogs: ApiLogEntry[] = [];
  lastResponse!: {
    status: number;
    body: unknown;
  };
  createdPet!: Pet;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL,
      extraHTTPHeaders: { Accept: 'application/json' },
    });
    this.client = new PetApiClient(this.apiContext, (entry) => {
      this.apiLogs.push(entry);
    });
  }

  async cleanup(): Promise<void> {
    await this.apiContext.dispose();
  }
}

// Register our custom World so Cucumber uses it for all scenarios
setWorldConstructor(CustomWorld);
