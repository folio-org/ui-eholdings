export const GET_KB_CREDENTIALS_USERS = 'GET_KB_CREDENTIALS_USERS';

export const getKBCredentialsUsers = credentialsId => ({
  type: GET_KB_CREDENTIALS_USERS,
  payload: { credentialsId },
});
