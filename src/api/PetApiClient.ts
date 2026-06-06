import { APIRequestContext, APIResponse } from '@playwright/test';
import { CreatePetPayload, UpdatePetPayload } from '../types/petstore.types';
import { PetEndpoints } from './endpoints/pet';

export type ApiLogEntry =
  | { type: 'REQUEST'; method: string; url: string; data?: unknown }
  | { type: 'RESPONSE'; method: string; url: string; status: number };

export type ApiLogger = (entry: ApiLogEntry) => void;

// API client for Petstore endpoints
export class PetApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly logger?: ApiLogger
  ) {}

  private log(entry: ApiLogEntry): void {
    this.logger?.(entry);
  }

  async createPet(payload: CreatePetPayload): Promise<APIResponse> {
    const url = PetEndpoints.CREATE_PET;
    this.log({ type: 'REQUEST', method: 'POST', url, data: payload });
    const response = await this.request.post(url, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });
    this.log({ type: 'RESPONSE', method: 'POST', url, status: response.status() });
    return response;
  }

  async getPetById(petId: number): Promise<APIResponse> {
    const url = PetEndpoints.GET_PET_BY_ID(petId);
    this.log({ type: 'REQUEST', method: 'GET', url });
    const response = await this.request.get(url);
    this.log({ type: 'RESPONSE', method: 'GET', url, status: response.status() });
    return response;
  }

  async getPetsByStatus(
    status: 'available' | 'pending' | 'sold'
  ): Promise<APIResponse> {
    const url = PetEndpoints.GET_PETS_BY_STATUS;
    this.log({ type: 'REQUEST', method: 'GET', url, data: { status } });
    const response = await this.request.get(url, { params: { status } });
    this.log({ type: 'RESPONSE', method: 'GET', url, status: response.status() });
    return response;
  }

  async updatePet(payload: UpdatePetPayload): Promise<APIResponse> {
    const url = PetEndpoints.UPDATE_PET;
    this.log({ type: 'REQUEST', method: 'PUT', url, data: payload });
    const response = await this.request.put(url, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });
    this.log({ type: 'RESPONSE', method: 'PUT', url, status: response.status() });
    return response;
  }

  async deletePet(petId: number): Promise<APIResponse> {
    const url = PetEndpoints.DELETE_PET(petId);
    this.log({ type: 'REQUEST', method: 'DELETE', url });
    const response = await this.request.delete(url);
    this.log({ type: 'RESPONSE', method: 'DELETE', url, status: response.status() });
    return response;
  }
}
