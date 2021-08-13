import {
  getProviderPackagesFailure,
  GET_PROVIDER_PACKAGES_FAILURE,
} from '../get-provider-packages-failure';

describe('getProviderPackagesFailureAction', () => {
  it('should return an action object', () => {
    const errors = ['error'];

    expect(getProviderPackagesFailure({ errors })).toEqual({
      type: GET_PROVIDER_PACKAGES_FAILURE,
      payload: errors,
    });
  });
});
