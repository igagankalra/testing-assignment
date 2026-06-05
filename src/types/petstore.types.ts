// Petstore API Types
export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export type PetStatus = 'available' | 'pending' | 'sold';

export interface Pet {
  id: number;
  name: string;
  status: PetStatus;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
}

export type CreatePetPayload = Pet;

export type UpdatePetPayload = Pet;

export interface ApiErrorResponse {
  code: number;
  type: string;
  message: string;
}
