export const GET_PACKAGE_TITLES_FAILURE = 'GET_PACKAGE_TITLES_FAILURE';

export function getPackageTitlesFailure({ errors }) {
  return {
    type: GET_PACKAGE_TITLES_FAILURE,
    payload: errors,
  };
}
