export const GET_UC_CREDENTIALS_SUCCESS = 'GET_UC_CREDENTIALS_SUCCESS';

export const getUcCredentialsSuccess = ({ attributes }) => ({
  type: GET_UC_CREDENTIALS_SUCCESS,
  payload: attributes.isPresent,
});
