import {
  getProviderPackages,
  GET_PROVIDER_PACKAGES,
} from '../get-provider-packages';

describe('getProviderPackagesAction', () => {
  it('should return an action object', () => {
    expect(getProviderPackages('id')).toEqual({
      type: GET_PROVIDER_PACKAGES,
      payload: 'id',
    });
  });
});
