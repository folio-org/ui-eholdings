import {
  updateUcCredentialsSuccess,
  UPDATE_UC_CREDENTIALS_SUCCESS,
} from '../update-uc-credentials-success';

describe('updateUcCredentialsSuccessAction', () => {
  it('should return an action object', () => {
    expect(updateUcCredentialsSuccess()).toEqual({
      type: UPDATE_UC_CREDENTIALS_SUCCESS,
    });
  });
});
