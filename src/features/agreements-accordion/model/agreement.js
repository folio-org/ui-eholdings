export default class Agreement {
  id = '';
  type = 'external';
  authority = '';
  reference = '';
  label = '';
  resourceName = '';

  constructor({
    id,
    refId,
    authorityType,
    label,
    resourceName,
  }) {
    this.id = id;
    this.reference = refId;
    this.authority = authorityType;
    this.label = label;
    this.resourceName = resourceName;
  }
}
