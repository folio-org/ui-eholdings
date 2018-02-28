import { Model, belongsTo, hasMany } from '@bigtest/mirage';

export default Model.extend({
  customerResources: hasMany(),
  provider: belongsTo()
});
