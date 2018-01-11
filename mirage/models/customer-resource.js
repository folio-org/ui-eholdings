import { Model, belongsTo, hasMany } from 'mirage-server';

export default Model.extend({
  package: belongsTo(),
  title: belongsTo(),
  customCoverages: hasMany()
});
