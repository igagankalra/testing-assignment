import { APIRequestContext, APIResponse } from '@playwright/test';
import { CreatePetPayload, UpdatePetPayload } from '../types/petstore.types';
import { PetEndpoints } from './endpoints/pet';

// API client for Petstore endpoints
export class PetApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async createPet(payload: CreatePetPayload): Promise<APIResponse> {
    return this.request.post(`${PetEndpoints.BASE_URL}${PetEndpoints.CREATE_PET}`, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getPetById(petId: number): Promise<APIResponse> {
    return this.request.get(
      `${PetEndpoints.BASE_URL}${PetEndpoints.GET_PET_BY_ID(petId)}`
    );
  }

  async getPetsByStatus(
    status: 'available' | 'pending' | 'sold'
  ): Promise<APIResponse> {
    return this.request.get(`${PetEndpoints.BASE_URL}${PetEndpoints.GET_PETS_BY_STATUS}`, {
      params: { status },
    });
  }

  async updatePet(payload: UpdatePetPayload): Promise<APIResponse> {
    return this.request.put(`${PetEndpoints.BASE_URL}${PetEndpoints.UPDATE_PET}`, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async deletePet(petId: number): Promise<APIResponse> {
    return this.request.delete(
      `${PetEndpoints.BASE_URL}${PetEndpoints.DELETE_PET(petId)}`
    );
  }
}
