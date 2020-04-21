export const DELETE_ACCESS_TYPE = 'DELETE_ACCESS_TYPE';

export function deleteAccessType(id, credentialId) {
  return {
    type: DELETE_ACCESS_TYPE,
    payload: { id, credentialId },
  };
}
