import {
  clearPackageTitles,
  CLEAR_PACKAGE_TITLES,
} from '../clear-package-titles';

describe('clearPackageTitlesAction', () => {
  it('should return an action object', () => {
    expect(clearPackageTitles()).toEqual({
      type: CLEAR_PACKAGE_TITLES,
    });
  });
});
