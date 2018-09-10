import { Model, hasMany } from '@bigtest/mirage';

export default Model.extend({
  packages: hasMany()
});
