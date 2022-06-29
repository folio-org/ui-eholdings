import {
  getUcCredentialsClientIdFailure,
  GET_UC_CREDENTIALS_CLIENT_ID_FAILURE,
} from '../get-uc-credentials-client-id-failure';

describe('getUcCredentialsClientIdFailureAction', () => {
  it('should return an action object', () => {
    const errors = ['error'];

    expect(getUcCredentialsClientIdFailure(errors)).toEqual({
      type: GET_UC_CREDENTIALS_CLIENT_ID_FAILURE,
      payload: errors,
    });
  });
});
