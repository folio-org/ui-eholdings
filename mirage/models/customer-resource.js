import { Model, belongsTo, hasMany } from 'mirage-server';

export default Model.extend({
  package: belongsTo(),
  title: belongsTo(),
  visibilityData: belongsTo(),
  customEmbargoPeriod: belongsTo('embargo-period'),
  managedEmbargoPeriod: belongsTo('embargo-period'),
  managedCoverageList: hasMany('managed-coverage')
});
