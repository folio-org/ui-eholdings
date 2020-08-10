import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  resources: hasMany(),
  provider: belongsTo(),
  accessType: belongsTo(),
});
