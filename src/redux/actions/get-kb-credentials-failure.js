export const GET_KB_CREDENTIALS_FAILURE = 'getKbCredentialsFailure';

export const getKbCredentialsFailure = error => ({
  type: GET_KB_CREDENTIALS_FAILURE,
  payload: error,
});
