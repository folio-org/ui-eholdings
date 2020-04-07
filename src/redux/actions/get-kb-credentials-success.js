export const GET_KB_CREDENTIALS_SUCCESS = 'getKbCredentialsSuccess';

export const getKbCredentialsSuccess = (credentials) => ({
  type: GET_KB_CREDENTIALS_SUCCESS,
  payload: credentials,
});
