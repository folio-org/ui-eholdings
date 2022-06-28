import {
  getUcCredentialsClientId,
  GET_UC_CREDENTIALS_CLIENT_ID,
} from '../get-uc-credentials-client-id';

describe('getUcCredentialsClientIdAction', () => {
  it('should return an action object', () => {
    expect(getUcCredentialsClientId()).toEqual({ type: GET_UC_CREDENTIALS_CLIENT_ID });
  });
});
