export const PUT_KB_CREDENTIALS_FAILURE = 'PUT_KB_CREDENTIALS_FAILURE';

export const putKBCredentialsFailure = error => ({
  type: PUT_KB_CREDENTIALS_FAILURE,
  payload: error,
});
