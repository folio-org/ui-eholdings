export const ATTACH_ACCESS_TYPE_FAILURE = 'ATTACH_ACCESS_TYPE_FAILURE';

export function attachAccessTypeFailure(payload) {
  return {
    type: ATTACH_ACCESS_TYPE_FAILURE,
    payload,
  };
}
