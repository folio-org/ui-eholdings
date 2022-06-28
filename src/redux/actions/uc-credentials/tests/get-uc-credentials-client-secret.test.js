import {
  getUcCredentialsClientSecret,
  GET_UC_CREDENTIALS_CLIENT_SECRET,
} from '../get-uc-credentials-client-secret';

describe('getUcCredentialsClientSecretAction', () => {
  it('should return an action object', () => {
    expect(getUcCredentialsClientSecret()).toEqual({ type: GET_UC_CREDENTIALS_CLIENT_SECRET });
  });
});
