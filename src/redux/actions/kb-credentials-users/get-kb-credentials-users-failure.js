export const GET_KB_CREDENTIALS_USERS_FAILURE = 'GET_KB_CREDENTIALS_USERS_FAILURE';

export const getKBCredentialsUsersFailure = error => ({
  type: GET_KB_CREDENTIALS_USERS_FAILURE,
  payload: error
});
