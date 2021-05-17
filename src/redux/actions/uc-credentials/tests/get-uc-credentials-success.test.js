import {
  getUcCredentialsSuccess,
  GET_UC_CREDENTIALS_SUCCESS,
} from '../get-uc-credentials-success';

describe('getUcCredentialsSuccessAction', () => {
  it('should return an action object', () => {
    const data = {
      attributes: { isPresent: true },
    };

    expect(getUcCredentialsSuccess(data)).toEqual({
      type: GET_UC_CREDENTIALS_SUCCESS,
      payload: data.attributes.isPresent,
    });
  });
});
