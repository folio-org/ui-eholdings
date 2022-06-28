import {
  getUcCredentialsClientIdSuccess,
  GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS,
} from '../get-uc-credentials-client-id-success';

describe('getUcCredentialsClientIdSuccessAction', () => {
  it('should return an action object', () => {
    const data = {
      clientId: 'client-id',
    };

    expect(getUcCredentialsClientIdSuccess(data)).toEqual({
      type: GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS,
      payload: data.clientId,
    });
  });
});
