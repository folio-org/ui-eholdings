export const GET_PROVIDER_PACKAGES_FAILURE = 'GET_PROVIDER_PACKAGES_FAILURE';

export function getProviderPackagesFailure({ errors }) {
  return {
    type: GET_PROVIDER_PACKAGES_FAILURE,
    payload: errors,
  };
}
