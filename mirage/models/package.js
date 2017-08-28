import { Model, belongsTo } from 'mirage-server';

export default Model.extend({
  vendor: belongsTo(),
  visibilityData: belongsTo()
});
