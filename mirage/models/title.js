import { Model, hasMany } from 'mirage-server';

export default Model.extend({
  customerResources: hasMany(),
  subjects: hasMany()
});
