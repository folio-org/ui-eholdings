import {
  getProviderPackagesSuccess,
  GET_PROVIDER_PACKAGES_SUCCESS,
} from '../get-provider-packages-success';

describe('getProviderPackagesSuccessAction', () => {
  it('should return an action object', () => {
    const data = ['package1', 'package2'];
    const meta = { totalResults: 2 };

    expect(getProviderPackagesSuccess({ data, meta })).toEqual({
      type: GET_PROVIDER_PACKAGES_SUCCESS,
      payload: { data, totalResults: meta.totalResults },
    });
  });
});
