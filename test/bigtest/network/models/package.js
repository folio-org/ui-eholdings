import { Model, belongsTo, hasMany } from '@bigtest/mirage';

export default Model.extend({
  resources: hasMany(),
  provider: belongsTo(),
  accessType: belongsTo(),
});
