import { Model, hasMany, belongsTo } from 'mirage-server';

export default Model.extend({
  package: belongsTo(),
  contributors: hasMany(),
  customerResources: hasMany(),
  identifiers: hasMany(),
  subjects: hasMany()
});
