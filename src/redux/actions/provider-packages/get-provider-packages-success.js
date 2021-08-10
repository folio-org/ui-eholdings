export const GET_PROVIDER_PACKAGES_SUCCESS = 'GET_PROVIDER_PACKAGES_SUCCESS';

export function getProviderPackagesSuccess({ data, meta }) {
  return {
    type: GET_PROVIDER_PACKAGES_SUCCESS,
    payload: {
      data,
      totalResults: meta.totalResults,
    },
  };
}
