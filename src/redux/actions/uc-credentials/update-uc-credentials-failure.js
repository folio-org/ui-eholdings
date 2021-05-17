export const UPDATE_UC_CREDENTIALS_FAILURE = 'UPDATE_UC_CREDENTIALS_FAILURE';

export function updateUcCredentialsFailure(payload) {
  return {
    type: UPDATE_UC_CREDENTIALS_FAILURE,
    payload,
  };
}
