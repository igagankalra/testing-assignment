// Pet API endpoints for Petstore
export const PetEndpoints = {
  BASE_URL: process.env.API_BASE_URL || 'https://petstore.swagger.io/v2',
  CREATE_PET: '/pet',
  GET_PET_BY_ID: (petId: number) => `/pet/${petId}`,
  GET_PETS_BY_STATUS: '/pet/findByStatus',
  UPDATE_PET: '/pet',
  DELETE_PET: (petId: number) => `/pet/${petId}`,
};
