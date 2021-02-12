export const DELETE_KB_CREDENTIALS = 'DELETE_KB_CREDENTIALS';

export const deleteKBCredentials = id => ({
  type: DELETE_KB_CREDENTIALS,
  payload: { id },
});
