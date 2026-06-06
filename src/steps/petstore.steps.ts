import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '@support/world';
import { Pet } from '../types/petstore.types';

// 6-digit per-run id avoids collisions on the shared public Petstore API.
const PET_ID = Date.now() % 1_000_000;

const createPetPayload = (name: string, status: Pet['status']): Pet => ({
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
    const response = await this.client.createPet(
      createPetPayload(name, status as Pet['status'])
    );
    this.createdPet = await response.json() as Pet;
  }
);

When(
  'I send a POST request to {string}',
  async function (this: CustomWorld, _path: string) {
    const response = await this.client.createPet(this.createdPet);
    this.lastResponse = { status: response.status(), body: await response.json() };
  }
);

// Regex form: literal {id} can't be escaped reliably in cucumber expressions.
When(
  /^I send a GET request to "\/pet\/\{id\}" using the created pet's ID$/,
  async function (this: CustomWorld) {
    const response = await this.client.getPetById(this.createdPet.id);
    this.lastResponse = { status: response.status(), body: await response.json() };
  }
);

When(
  'I send a GET request to {string}',
  async function (this: CustomWorld, path: string) {
    const id = parseInt(path.split('/').pop() ?? '0', 10);
    const response = await this.client.getPetById(id);
    this.lastResponse = { status: response.status(), body: await response.json() };
  }
);

When(
  'I send a PUT request to {string} with updated name {string} and status {string}',
  async function (this: CustomWorld, _path: string, name: string, status: string) {
    const updated: Pet = { ...this.createdPet, name, status: status as Pet['status'] };
    const response = await this.client.updatePet(updated);
    this.lastResponse = { status: response.status(), body: await response.json() };
  }
);

When(
  /^I send a DELETE request to "\/pet\/\{id\}" using the created pet's ID$/,
  async function (this: CustomWorld) {
    const response = await this.client.deletePet(this.createdPet.id);
    this.lastResponse = { status: response.status(), body: await response.json() };
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
    expect((this.lastResponse.body as Pet).name).toBe(expectedName);
  }
);

Then(
  'the response body should contain the status {string}',
  function (this: CustomWorld, expectedStatus: string) {
    expect((this.lastResponse.body as Pet).status).toBe(expectedStatus);
  }
);

Then(
  'the response body pet name should match {string}',
  function (this: CustomWorld, expectedName: string) {
    expect((this.lastResponse.body as Pet).name).toBe(expectedName);
  }
);

Then(
  'the response body pet status should match {string}',
  function (this: CustomWorld, expectedStatus: string) {
    expect((this.lastResponse.body as Pet).status).toBe(expectedStatus);
  }
);

Then(
  'the response body pet ID should match the one returned by POST',
  function (this: CustomWorld) {
    expect((this.lastResponse.body as Pet).id).toBe(this.createdPet.id);
  }
);

Then(
  'the response body should contain the message {string}',
  function (this: CustomWorld, expectedMessage: string) {
    expect((this.lastResponse.body as { message: string }).message).toBe(expectedMessage);
  }
);
