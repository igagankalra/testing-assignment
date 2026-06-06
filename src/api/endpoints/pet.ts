// Relative paths only — base URL is set on the request context.
// A leading slash would replace the base path and drop /v2.
export const PetEndpoints = {
  CREATE_PET: 'pet',
  GET_PET_BY_ID: (petId: number) => `pet/${petId}`,
  GET_PETS_BY_STATUS: 'pet/findByStatus',
  UPDATE_PET: 'pet',
  DELETE_PET: (petId: number) => `pet/${petId}`,
};
