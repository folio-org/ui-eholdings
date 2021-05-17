import {
  getUcCredentialsFailure,
  GET_UC_CREDENTIALS_FAILURE,
} from '../get-uc-credentials-failure';

describe('getUcCredentialsFailureAction', () => {
  it('should return an action object', () => {
    const errors = ['error'];

    expect(getUcCredentialsFailure(errors)).toEqual({
      type: GET_UC_CREDENTIALS_FAILURE,
      payload: errors,
    });
  });
});
