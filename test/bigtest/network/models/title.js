import { Model, hasMany } from 'miragejs';

export default Model.extend({
  resources: hasMany(),
});
