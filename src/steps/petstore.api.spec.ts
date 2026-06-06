import { test, expect, APIRequestContext, request } from '@playwright/test';
import { PetApiClient } from '@api/PetApiClient';
import { Pet } from '../types/petstore.types';
import 'dotenv/config';

const DEFAULT_API_BASE_URL = 'https://petstore.swagger.io/v2/';

// 6-digit per-run id avoids collisions on the shared public Petstore API.
const TEST_PET_ID = Date.now() % 1_000_000;

const TEST_PET: Pet = {
  id: TEST_PET_ID,
  name: 'Bruno',
  status: 'available',
  photoUrls: ['https://example.com/bruno.jpg'],
  category: { id: 1, name: 'Dogs' },
  tags: [{ id: 1, name: 'friendly' }],
};

test.describe('Petstore API - Pet endpoints', () => {
  let apiContext: APIRequestContext;
  let client: PetApiClient;

  test.beforeAll(async () => {
    apiContext = await request.newContext({
      baseURL: process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL,
      extraHTTPHeaders: { Accept: 'application/json' },
    });
    client = new PetApiClient(apiContext);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('TC-API-01: POST /pet creates a pet', async () => {
    const response = await client.createPet(TEST_PET);
    expect(response.status()).toBe(200);

    const body = await response.json() as Pet;
    expect(body.id).toBe(TEST_PET.id);
    expect(body.name).toBe(TEST_PET.name);
    expect(body.status).toBe(TEST_PET.status);
  });

  test('TC-API-02: GET /pet/{id} returns the pet created by POST', async () => {
    const response = await client.getPetById(TEST_PET.id);
    expect(response.status()).toBe(200);

    const body = await response.json() as Pet;
    expect(body.id).toBe(TEST_PET.id);
    expect(body.name).toBe(TEST_PET.name);
    expect(body.status).toBe(TEST_PET.status);
    expect(body.category?.name).toBe(TEST_PET.category?.name);
    expect(body.photoUrls).toContain(TEST_PET.photoUrls[0]);
  });

  test('TC-API-03: PUT /pet updates name and status', async () => {
    const updated: Pet = { ...TEST_PET, name: 'Bruno Updated', status: 'pending' };
    const response = await client.updatePet(updated);
    expect(response.status()).toBe(200);

    const body = await response.json() as Pet;
    expect(body.id).toBe(TEST_PET.id);
    expect(body.name).toBe('Bruno Updated');
    expect(body.status).toBe('pending');
  });

  test('TC-API-04: DELETE /pet/{id} removes the pet', async () => {
    const deleteResponse = await client.deletePet(TEST_PET.id);
    expect(deleteResponse.status()).toBe(200);

    const getResponse = await client.getPetById(TEST_PET.id);
    expect(getResponse.status()).toBe(404);
  });

  test('TC-API-05: GET /pet/{id} returns 404 for a missing pet', async () => {
    const response = await client.getPetById(999_999_999);
    expect(response.status()).toBe(404);

    const body = await response.json() as { message: string };
    expect(body.message).toBe('Pet not found');
  });

  test('TC-API-06: GET /pet/findByStatus filters by status', async () => {
    const response = await client.getPetsByStatus('available');
    expect(response.status()).toBe(200);

    const pets = await response.json() as Pet[];
    expect(Array.isArray(pets)).toBe(true);
    pets.forEach((pet) => expect(pet.status).toBe('available'));
  });
});
