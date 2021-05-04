import {
  getPackageTitles,
  GET_PACKAGE_TITLES,
} from "../get-package-titles";

describe('getPackageTitlesAction', () => {
  it('should return an action object', () => {
    expect(getPackageTitles('id')).toEqual({
      type: GET_PACKAGE_TITLES,
      payload: 'id',
    });
  });
});
