import { Model, belongsTo, hasMany } from 'mirage-server';

export default Model.extend({
  customerResources: hasMany(),
  vendor: belongsTo()
});
