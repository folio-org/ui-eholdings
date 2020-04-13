export const DELETE_KB_CREDENTIALS_USER = 'DELETE_KB_CREDENTIALS_USER';

export const deleteKBCredentialsUser = (userId, credentialsId) => ({
  type: DELETE_KB_CREDENTIALS_USER,
  payload: {
    userId,
    credentialsId,
  },
});
