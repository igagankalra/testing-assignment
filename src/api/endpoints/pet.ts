// Pet API endpoints (relative paths — base URL is set on the request context).
// NOTE: no leading slash. With Playwright's baseURL, a leading slash resets the
// path and drops segments like /v2. Keep paths relative.
export const PetEndpoints = {
  CREATE_PET: 'pet',
  GET_PET_BY_ID: (petId: number) => `pet/${petId}`,
  GET_PETS_BY_STATUS: 'pet/findByStatus',
  UPDATE_PET: 'pet',
  DELETE_PET: (petId: number) => `pet/${petId}`,
};
