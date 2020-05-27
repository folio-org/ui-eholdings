export const POST_KB_CREDENTIALS_USER = 'POST_KB_CREDENTIALS_USER';

export const postKBCredentialsUser = (credentialsId, userData) => ({
  type: POST_KB_CREDENTIALS_USER,
  payload: {
    credentialsId,
    userData,
  },
});
