import { Model, belongsTo } from 'mirage-server';

export default Model.extend({
  package: belongsTo(),
  title: belongsTo(),
  visibilityData: belongsTo(),
  customEmbargoPeriod: belongsTo('embargo-period'),
  managedEmbargoPeriod: belongsTo('embargo-period')
});
