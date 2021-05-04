import {
  getPackageTitlesSuccess,
  GET_PACKAGE_TITLES_SUCCESS,
} from "../get-package-titles-success";

describe('getPackageTitlesSuccessAction', () => {
  it('should return an action object', () => {
    const data = ['title1', 'title2'];
    const meta = { totalResults: 2 };

    expect(getPackageTitlesSuccess({ data, meta })).toEqual({
      type: GET_PACKAGE_TITLES_SUCCESS,
      payload: { data, totalResults: meta.totalResults },
    });
  });
});
