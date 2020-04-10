export const UPDATE_ROOT_PROXY = 'UPDATE_ROOT_PROXY';

export function updateRootProxy(rootProxy, credentialId) {
  return {
    type: UPDATE_ROOT_PROXY,
    payload: {
      rootProxy,
      credentialId,
    },
  };
}
