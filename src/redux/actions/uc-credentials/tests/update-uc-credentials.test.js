import {
  updateUcCredentials,
  UPDATE_UC_CREDENTIALS,
} from '../update-uc-credentials';

describe('updateUcCredentialsAction', () => {
  it('should return an action object', () => {
    const data = {
      clientId: 'id',
      clientSecret: 'key',
    };

    expect(updateUcCredentials(data)).toEqual({
      type: UPDATE_UC_CREDENTIALS,
      payload: data,
    });
  });
});
