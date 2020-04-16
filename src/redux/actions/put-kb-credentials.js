export const PUT_KB_CREDENTIALS = 'PUT_KB_CREDENTIALS';

export const putKBCredentials = (data, credentialId) => ({
  type: PUT_KB_CREDENTIALS,
  payload: {
    data,
    credentialId,
  },
});
