export const ATTACH_ACCESS_TYPE = 'ATTACH_ACCESS_TYPE';

export function attachAccessType(payload) {
  return {
    type: ATTACH_ACCESS_TYPE,
    payload,
  };
}
