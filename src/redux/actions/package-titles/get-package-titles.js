export const GET_PACKAGE_TITLES = 'GET_PACKAGE_TITLES';

export function getPackageTitles(payload) {
  return {
    type: GET_PACKAGE_TITLES,
    payload,
  };
}
