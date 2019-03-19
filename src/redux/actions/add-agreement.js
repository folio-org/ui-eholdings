export const ADD_AGREEMENT = 'ADD_AGREEMENT';

export function addAgreement(payload) {
  return {
    type: ADD_AGREEMENT,
    payload,
  };
}
