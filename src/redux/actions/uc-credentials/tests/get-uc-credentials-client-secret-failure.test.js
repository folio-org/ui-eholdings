import {
  getUcCredentialsClientSecretFailure,
  GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE,
} from '../get-uc-credentials-client-secret-failure';

describe('getUcCredentialsClientSecretFailureAction', () => {
  it('should return an action object', () => {
    const errors = ['error'];

    expect(getUcCredentialsClientSecretFailure(errors)).toEqual({
      type: GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE,
      payload: errors,
    });
  });
});
