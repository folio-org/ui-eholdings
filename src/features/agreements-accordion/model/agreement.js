export default class Agreement {
  id = '';
  type = 'external';
  authority = '';
  reference = '';
  label = '';

  constructor({ id, refId, authorityType, label }) {
    this.id = id;
    this.reference = refId;
    this.authority = authorityType;
    this.label = label;
  }
}
