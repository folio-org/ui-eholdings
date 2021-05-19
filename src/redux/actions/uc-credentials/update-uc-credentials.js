export const UPDATE_UC_CREDENTIALS = 'UPDATE_UC_CREDENTIALS';

export function updateUcCredentials(payload) {
  return {
    type: UPDATE_UC_CREDENTIALS,
    payload,
  };
}
