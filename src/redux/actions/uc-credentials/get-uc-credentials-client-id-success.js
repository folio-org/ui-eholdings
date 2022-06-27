export const GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS = 'GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS';

export const getUcCredentialsClientIdSuccess = ({ clientId }) => ({
  type: GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS,
  payload: clientId,
});
