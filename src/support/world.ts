import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { request, APIRequestContext } from '@playwright/test';
import { PetApiClient } from '../api/PetApiClient';
import { Pet } from '../types/petstore.types';

// Shared state across Cucumber steps in a scenario
export class CustomWorld extends World {
  apiContext!: APIRequestContext;
  client!: PetApiClient;
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
      extraHTTPHeaders: { Accept: 'application/json' },
    });
    this.client = new PetApiClient(this.apiContext);
  }

  async cleanup(): Promise<void> {
    await this.apiContext.dispose();
  }
}

// Register our custom World so Cucumber uses it for all scenarios
setWorldConstructor(CustomWorld);
