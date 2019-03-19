import pick from 'lodash/pick';

export default function pickAgreementProps(agreement) {
  return pick(agreement, ['id', 'agreementStatus', 'name', 'startDate']);
}
