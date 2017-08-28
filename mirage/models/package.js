import { Model, belongsTo } from 'mirage-server';

export default Model.extend({
  customCoverage: belongsTo(),
  vendor: belongsTo(),
  visibilityData: belongsTo()
});
