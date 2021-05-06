export const GET_PACKAGE_TITLES_SUCCESS = 'GET_PACKAGE_TITLES_SUCCESS';

export function getPackageTitlesSuccess({ data, meta }) {
  return {
    type: GET_PACKAGE_TITLES_SUCCESS,
    payload: {
      data,
      totalResults: meta.totalResults,
    },
  };
}
