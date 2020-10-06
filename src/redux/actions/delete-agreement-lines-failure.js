export const DELETE_AGREEMENT_LINES_FAILURE = 'DELETE_AGREEMENT_LINES_FAILURE';

export const deleteAgreementLinesFailure = payload => ({
  type: DELETE_AGREEMENT_LINES_FAILURE,
  payload,
});
