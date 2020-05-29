export const DELETE_ACCESS_TYPE = 'DELETE_ACCESS_TYPE';

export function deleteAccessType(accessType, credentialId) {
  return {
    type: DELETE_ACCESS_TYPE,
    payload: { accessType, credentialId },
  };
}
