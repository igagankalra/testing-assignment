import { APIRequestContext, APIResponse } from '@playwright/test';
import { CreatePetPayload, UpdatePetPayload } from '../types/petstore.types';

const BASE_URL = 'https://petstore.swagger.io/v2';

// API client for Petstore endpoints
export class PetApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async createPet(payload: CreatePetPayload): Promise<APIResponse> {
    return this.request.post(`${BASE_URL}/pet`, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getPetById(petId: number): Promise<APIResponse> {
    return this.request.get(`${BASE_URL}/pet/${petId}`);
  }

  async getPetsByStatus(
    status: 'available' | 'pending' | 'sold'
  ): Promise<APIResponse> {
    return this.request.get(`${BASE_URL}/pet/findByStatus`, {
      params: { status },
    });
  }

  async updatePet(payload: UpdatePetPayload): Promise<APIResponse> {
    return this.request.put(`${BASE_URL}/pet`, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async deletePet(petId: number): Promise<APIResponse> {
    return this.request.delete(`${BASE_URL}/pet/${petId}`);
  }
}
