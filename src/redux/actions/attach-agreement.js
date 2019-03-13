export const ATTACH_AGREEMENT = 'ATTACH_AGREEMENT';

export function attachAgreement(payload) {
  return {
    type: ATTACH_AGREEMENT,
    payload,
  };
}
