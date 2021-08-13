import {
  clearProviderPackages,
  CLEAR_PROVIDER_PACKAGES,
} from '../clear-provider-packages';

describe('clearProviderPackagesAction', () => {
  it('should return an action object', () => {
    expect(clearProviderPackages()).toEqual({
      type: CLEAR_PROVIDER_PACKAGES,
    });
  });
});
