import {
  getPackageTitlesFailure,
  GET_PACKAGE_TITLES_FAILURE,
} from '../get-package-titles-failure';

describe('getPackageTitlesFailureAction', () => {
  it('should return an action object', () => {
    const errors = ['error'];

    expect(getPackageTitlesFailure({ errors })).toEqual({
      type: GET_PACKAGE_TITLES_FAILURE,
      payload: errors,
    });
  });
});
