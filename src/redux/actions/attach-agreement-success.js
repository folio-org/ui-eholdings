export const ATTACH_AGREEMENT_SUCCESS = 'ATTACH_AGREEMENT_SUCCESS';

export function attachAgreementSuccess(payload) {
  return {
    type: 'ATTACH_AGREEMENT_SUCCESS',
    payload: {
      ...payload,
      isLoading: false,
    },
  };
};
