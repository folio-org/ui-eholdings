export const GET_KB_CREDENTIALS_USERS_FAILURE = 'GET_KB_CREDENTIALS_USERS_FAILURE';

export const getKBCredentialsUsersFailure = ({ errors }) => ({
  type: GET_KB_CREDENTIALS_USERS_FAILURE,
  payload: errors
});
