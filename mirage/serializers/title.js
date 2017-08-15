import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  /*
   * Title records DO return embedded records, not just ids of the relationships.
  */
  embed: true,
  serializeIds: 'never',
  include: ['customerResources']
});
