import {
  getUcCredentialsClientSecretSuccess,
  GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS,
} from '../get-uc-credentials-client-secret-success';

describe('getUcCredentialsClientSecretSuccessAction', () => {
  it('should return an action object', () => {
    const data = {
      clientSecret: 'client-secret',
    };

    expect(getUcCredentialsClientSecretSuccess(data)).toEqual({
      type: GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS,
      payload: data.clientSecret,
    });
  });
});
