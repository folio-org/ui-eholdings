export const GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS = 'GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS';

export const getUcCredentialsClientSecretSuccess = ({ clientSecret }) => ({
  type: GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS,
  payload: clientSecret,
});
