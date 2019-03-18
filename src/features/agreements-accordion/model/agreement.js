export default class Agreement {
  type = 'external';
  authority = 'EKB';
  reference = '';
  label = '';

  constructor({ reference, label }) {
    this.reference = reference;
    this.label = label;
  }
}
