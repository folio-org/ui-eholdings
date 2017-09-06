import { Model, hasMany, belongsTo } from 'mirage-server';

export default Model.extend({
  package: belongsTo(),
  customerResources: hasMany(),
  identifiers: hasMany(),
  subjects: hasMany()
});
