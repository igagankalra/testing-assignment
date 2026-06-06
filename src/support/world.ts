import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { request, APIRequestContext } from '@playwright/test';
import { PetApiClient, ApiLogEntry } from '@api/PetApiClient';
import { Pet } from '../types/petstore.types';
import 'dotenv/config';

// Trailing slash matters: Playwright joins paths via the URL spec,
// so a base without it (e.g. /v2) drops its last segment.
const DEFAULT_API_BASE_URL = 'https://petstore.swagger.io/v2/';

export class CustomWorld extends World {
  apiContext!: APIRequestContext;
  client!: PetApiClient;
  apiLogs: ApiLogEntry[] = [];
  lastResponse!: { status: number; body: unknown };
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

setWorldConstructor(CustomWorld);
