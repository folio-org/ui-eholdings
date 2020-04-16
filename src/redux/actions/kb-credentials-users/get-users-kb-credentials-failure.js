export const GET_USERS_KB_CREDENTIALS_FAILURE = 'GET_USERS_KB_CREDENTIALS_FAILURE';

export const getUsersKbCredentialsFailure = ({ errors }) => ({
  type: GET_USERS_KB_CREDENTIALS_FAILURE,
  payload: errors,
});
