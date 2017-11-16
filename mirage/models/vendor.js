import { Model, hasMany } from 'mirage-server';

export default Model.extend({
  packages: hasMany()
});
