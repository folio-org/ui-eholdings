import {
  updateUcCredentialsFailure,
  UPDATE_UC_CREDENTIALS_FAILURE,
} from '../update-uc-credentials-failure';

describe('updateUcCredentialsFailureAction', () => {
  it('should return an action object', () => {
    const errors = ['error'];

    expect(updateUcCredentialsFailure(errors)).toEqual({
      type: UPDATE_UC_CREDENTIALS_FAILURE,
      payload: errors,
    });
  });
});
