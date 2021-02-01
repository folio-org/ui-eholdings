export const DELETE_KB_CREDENTIALS_SUCCESS = 'DELETE_KB_CREDENTIALS_SUCCESS';

export const deleteKBCredentialsSuccess = id => ({
  type: DELETE_KB_CREDENTIALS_SUCCESS,
  payload: { id }
});
