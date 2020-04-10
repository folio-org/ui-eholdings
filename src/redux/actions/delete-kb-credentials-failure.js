export const DELETE_KB_CREDENTIALS_FAILURE = 'DELETE_KB_CREDENTIALS_FAILURE';

export const deleteKBCredentialsFailure = error => ({
  type: DELETE_KB_CREDENTIALS_FAILURE,
  payload: error
});
