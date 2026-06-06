import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '@support/world';
import { Pet } from '../types/petstore.types';

// Unique pet ID per test run (prevents collisions on shared public API)
const PET_ID = Date.now() % 1000000;

const createPetPayload = (name: string, status: Pet['status']) => ({
  id: PET_ID,
  name,
  status,
  photoUrls: ['https://example.com/photo.jpg'],
  category: { id: 1, name: 'Dogs' },
  tags: [{ id: 1, name: 'test' }],
});

Given(
  'I have a pet payload with name {string} and status {string}',
  async function (this: CustomWorld, name: string, status: string) {
    this.createdPet = createPetPayload(name, status as Pet['status']);
  }
);

Given(
  'I have previously created a pet with name {string} and status {string}',
  async function (this: CustomWorld, name: string, status: string) {
    const payload = createPetPayload(name, status as Pet['status']);
    const response = await this.client.createPet(payload);
    this.createdPet = await response.json() as Pet;
  }
);


When(
  'I send a POST request to {string}',
  async function (this: CustomWorld, _path: string) {
    const response = await this.client.createPet(this.createdPet);
    this.lastResponse = {
      status: response.status(),
      body: await response.json(),
    };
  }
);

// Regex form: cucumber-expression escaping of literal `{id}` is unreliable.
When(
  /^I send a GET request to "\/pet\/\{id\}" using the created pet's ID$/,
  async function (this: CustomWorld) {
    const response = await this.client.getPetById(this.createdPet.id);
    this.lastResponse = {
      status: response.status(),
      body: await response.json(),
    };
  }
);

When(
  'I send a GET request to {string}',
  async function (this: CustomWorld, path: string) {
    const id = parseInt(path.split('/').pop() ?? '0', 10);
    const response = await this.client.getPetById(id);
    this.lastResponse = {
      status: response.status(),
      body: await response.json(),
    };
  }
);

When(
  'I send a PUT request to {string} with updated name {string} and status {string}',
  async function (
    this: CustomWorld,
    _path: string,
    name: string,
    status: string
  ) {
    const updatedPet: Pet = {
      ...this.createdPet,
      name,
      status: status as Pet['status'],
    };
    const response = await this.client.updatePet(updatedPet);
    this.lastResponse = {
      status: response.status(),
      body: await response.json(),
    };
  }
);

When(
  /^I send a DELETE request to "\/pet\/\{id\}" using the created pet's ID$/,
  async function (this: CustomWorld) {
    const response = await this.client.deletePet(this.createdPet.id);
    this.lastResponse = {
      status: response.status(),
      body: await response.json(),
    };
  }
);


Then(
  'the response status code should be {int}',
  function (this: CustomWorld, expectedStatus: number) {
    expect(this.lastResponse.status).toBe(expectedStatus);
  }
);

Then(
  'the response body should contain the pet name {string}',
  function (this: CustomWorld, expectedName: string) {
    const body = this.lastResponse.body as Pet;
    expect(body.name).toBe(expectedName);
  }
);

Then(
  'the response body should contain the status {string}',
  function (this: CustomWorld, expectedStatus: string) {
    const body = this.lastResponse.body as Pet;
    expect(body.status).toBe(expectedStatus);
  }
);

Then(
  'the response body pet name should match {string}',
  function (this: CustomWorld, expectedName: string) {
    const body = this.lastResponse.body as Pet;
    expect(body.name).toBe(expectedName);
  }
);

Then(
  'the response body pet status should match {string}',
  function (this: CustomWorld, expectedStatus: string) {
    const body = this.lastResponse.body as Pet;
    expect(body.status).toBe(expectedStatus);
  }
);

Then(
  'the response body pet ID should match the one returned by POST',
  function (this: CustomWorld) {
    // KEY ASSERTION: POST data matches GET response
    // Verifies data persistence — the GET returns the same pet the POST created
    const body = this.lastResponse.body as Pet;
    expect(body.id).toBe(this.createdPet.id);
  }
);

Then(
  'the response body should contain the message {string}',
  function (this: CustomWorld, expectedMessage: string) {
    const body = this.lastResponse.body as { message: string };
    expect(body.message).toBe(expectedMessage);
  }
);
