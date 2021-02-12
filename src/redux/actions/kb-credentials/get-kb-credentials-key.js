export const GET_KB_CREDENTIALS_KEY = 'GET_KB_CREDENTIALS_KEY';

export const getKbCredentialsKey = credentialsId => ({
  type: GET_KB_CREDENTIALS_KEY,
  payload: credentialsId,
});
