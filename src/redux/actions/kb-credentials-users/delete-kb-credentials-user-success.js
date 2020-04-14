export const DELETE_KB_CREDENTIALS_USER_SUCCESS = 'DELETE_KB_CREDENTIALS_USER_SUCCESS';

export const deleteKBCredentialsUserSuccess = userId => ({
  type: DELETE_KB_CREDENTIALS_USER_SUCCESS,
  payload: { userId },
});
