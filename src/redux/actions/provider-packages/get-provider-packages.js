export const GET_PROVIDER_PACKAGES = 'GET_PROVIDER_PACKAGES';

export function getProviderPackages(payload) {
  return {
    type: GET_PROVIDER_PACKAGES,
    payload,
  };
}
