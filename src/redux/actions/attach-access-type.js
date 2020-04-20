export const ATTACH_ACCESS_TYPE = 'ATTACH_ACCESS_TYPE';

export function attachAccessType(accessType, credentialId) {
  return {
    type: ATTACH_ACCESS_TYPE,
    payload: {
      accessType,
      credentialId,
    },
  };
}
