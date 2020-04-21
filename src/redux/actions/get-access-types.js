export const GET_ACCESS_TYPES = 'GET_ACCESS_TYPES';

export function getAccessTypes(credentialId) {
  return {
    type: GET_ACCESS_TYPES,
    payload: credentialId,
  };
}
