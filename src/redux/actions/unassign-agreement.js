export const UNASSIGN_AGREEMENT = 'UNASSIGN_AGREEMENT';

export function unassignAgreement(id) {

  return {
    type: UNASSIGN_AGREEMENT,
    id,
  };
}
