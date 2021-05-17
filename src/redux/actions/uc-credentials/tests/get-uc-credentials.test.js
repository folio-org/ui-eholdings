import {
  getUcCredentials,
  GET_UC_CREDENTIALS,
} from '../get-uc-credentials';

describe('getUcCredentialsAction', () => {
  it('should return an action object', () => {
    expect(getUcCredentials()).toEqual({ type: GET_UC_CREDENTIALS });
  });
});
