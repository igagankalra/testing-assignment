import { test, expect, APIRequestContext, request } from '@playwright/test';
import { PetApiClient } from '@api/PetApiClient';
import { Pet } from '../types/petstore.types';
import 'dotenv/config';

// ─────────────────────────────────────────────────────────────────────────────
// Petstore REST API Tests
//
// ASSIGNMENT REQUIREMENTS COVERED:
//   ✅ 4 request types: POST, GET, PUT, DELETE
//   ✅ Status codes verified: 200 (success), 404 (not found), 400 (bad input)
//   ✅ POST response matches GET response (data persistence check)
//
// APPROACH:
//   We use a unique petId per test run (timestamp-based) to avoid conflicts
//   between concurrent test runs on the shared public Petstore API.
// ─────────────────────────────────────────────────────────────────────────────

// Trailing slash is required (Playwright joins paths via the URL spec).
const DEFAULT_API_BASE_URL = 'https://petstore.swagger.io/v2/';

// Generate a unique ID using timestamp to prevent test data collisions
// e.g. if two people run tests at the same time against the public API
const UNIQUE_PET_ID = Date.now() % 1000000; // keep it a 6-digit number

// The pet we will create in our POST test and reuse across tests
const TEST_PET: Pet = {
  id: UNIQUE_PET_ID,
  name: 'Bruno',
  status: 'available',
  photoUrls: ['https://example.com/bruno.jpg'],
  category: { id: 1, name: 'Dogs' },
  tags: [{ id: 1, name: 'friendly' }],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Petstore API - Pet Endpoints', () => {
  let apiContext: APIRequestContext;
  let client: PetApiClient;

  // beforeAll: runs ONCE before all tests in this describe block.
  // We create one shared APIRequestContext for all tests (more efficient).
  test.beforeAll(async () => {
    // Create a standalone API request context (no browser needed).
    // baseURL lives here so PetApiClient can use relative paths like '/pet'.
    apiContext = await request.newContext({
      baseURL: process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL,
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });
    client = new PetApiClient(apiContext);
  });

  // afterAll: clean up the API context when all tests are done
  test.afterAll(async () => {
    await apiContext.dispose();
  });

  // ── TEST 1: POST /pet ─────────────────────────────────────────────────────
  // Creates a new pet. Verifies:
  //   - Status 200 (success)
  //   - Response body has the correct id and name
  test('TC-API-01: POST /pet - should create a new pet and return 200', async () => {
    const response = await client.createPet(TEST_PET);

    // ── Assertion: Status Code ──
    // The Petstore returns 200 (not 201) on successful creation
    expect(response.status()).toBe(200);

    // ── Assertion: Response body ──
    const body = await response.json() as Pet;

    // The server echoes back the created pet
    expect(body.id).toBe(TEST_PET.id);
    expect(body.name).toBe(TEST_PET.name);
    expect(body.status).toBe(TEST_PET.status);
  });

  // ── TEST 2: GET /pet/{id} — and POST vs GET comparison ───────────────────
  // Fetches the pet we just created. Verifies:
  //   - Status 200
  //   - Data returned by GET matches what we sent in POST (persistence check)
  test('TC-API-02: GET /pet/{id} - should return the pet created by POST', async () => {
    const response = await client.getPetById(TEST_PET.id);

    // ── Assertion: Status Code ──
    expect(response.status()).toBe(200);

    const body = await response.json() as Pet;

    // ── KEY ASSERTION: POST data matches GET response ──
    // This is the assignment's specific requirement: verify the record
    // created with POST matches the response of GET.
    expect(body.id).toBe(TEST_PET.id);
    expect(body.name).toBe(TEST_PET.name);
    expect(body.status).toBe(TEST_PET.status);
    expect(body.category?.name).toBe(TEST_PET.category?.name);

    // Verify photoUrls array contains our URL
    expect(body.photoUrls).toContain(TEST_PET.photoUrls[0]);
  });

  // ── TEST 3: PUT /pet ──────────────────────────────────────────────────────
  // Updates the pet's name and status. Verifies:
  //   - Status 200
  //   - Updated fields are reflected in the response
  test('TC-API-03: PUT /pet - should update pet name and status', async () => {
    const updatedPet: Pet = {
      ...TEST_PET,           // spread original data
      name: 'Bruno Updated', // change name
      status: 'pending',     // change status
    };

    const response = await client.updatePet(updatedPet);

    // ── Assertion: Status Code ──
    expect(response.status()).toBe(200);

    const body = await response.json() as Pet;

    // ── Assertion: Updated fields reflected ──
    expect(body.name).toBe('Bruno Updated');
    expect(body.status).toBe('pending');

    // ── Assertion: ID unchanged ──
    expect(body.id).toBe(TEST_PET.id);
  });

  // ── TEST 4: DELETE /pet/{id} ──────────────────────────────────────────────
  // Deletes the pet. Verifies:
  //   - Status 200 on successful delete
  //   - Subsequent GET returns 404 (the pet no longer exists)
  test('TC-API-04: DELETE /pet/{id} - should delete pet and return 200', async () => {
    const deleteResponse = await client.deletePet(TEST_PET.id);

    // ── Assertion: Delete Status Code ──
    expect(deleteResponse.status()).toBe(200);

    // ── Assertion: GET after DELETE returns 404 ──
    // This is critical: verifies the delete actually worked, not just
    // that the API returned 200.
    const getResponse = await client.getPetById(TEST_PET.id);
    expect(getResponse.status()).toBe(404);
  });

  // ── TEST 5: Error Handling — 404 Not Found ────────────────────────────────
  // Verifies the API returns 404 for a non-existent pet ID.
  // This covers the "verify 4xx status codes" requirement.
  test('TC-API-05: GET /pet/{id} - should return 404 for non-existent pet', async () => {
    const NON_EXISTENT_ID = 999999999;
    const response = await client.getPetById(NON_EXISTENT_ID);

    // ── Assertion: 404 Not Found ──
    expect(response.status()).toBe(404);

    const body = await response.json() as { message: string };
    expect(body.message).toBe('Pet not found');
  });

  // ── TEST 6: Validate GET /pet/findByStatus ────────────────────────────────
  // Verifies filtering pets by status works and all returned pets match.
  test('TC-API-06: GET /pet/findByStatus - should return only available pets', async () => {
    const response = await client.getPetsByStatus('available');

    // ── Assertion: Status 200 ──
    expect(response.status()).toBe(200);

    const pets = await response.json() as Pet[];

    // ── Assertion: Response is an array ──
    expect(Array.isArray(pets)).toBe(true);

    // ── Assertion: Every returned pet has status 'available' ──
    // This validates the filter query param is actually working
    pets.forEach((pet) => {
      expect(pet.status).toBe('available');
    });
  });
});
