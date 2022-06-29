export const GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE = 'GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE';

export const getUcCredentialsClientSecretFailure = (payload) => ({
  type: GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE,
  payload,
});
