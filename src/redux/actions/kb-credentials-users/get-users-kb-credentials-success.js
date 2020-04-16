export const GET_USERS_KB_CREDENTIALS_SUCCESS = 'GET_USERS_KB_CREDENTIALS_SUCCESS';

export const getUsersKbCredentialsSuccess = (kbCredentials) => ({
  type: GET_USERS_KB_CREDENTIALS_SUCCESS,
  payload: kbCredentials,
});
