export const ATTACH_AGREEMENT_FAILURE = 'ATTACH_AGREEMENT_FAILURE';

export function attachAgreementFailure(payload) {
  return {
    type: ATTACH_AGREEMENT_FAILURE,
    payload,
  };
}
