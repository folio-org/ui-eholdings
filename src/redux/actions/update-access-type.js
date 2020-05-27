export const UPDATE_ACCESS_TYPE = 'UPDATE_ACCESS_TYPE';

export function updateAccessType(accessType, credentialId) {
  return {
    type: UPDATE_ACCESS_TYPE,
    payload: {
      accessType,
      credentialId,
    },
  };
}
