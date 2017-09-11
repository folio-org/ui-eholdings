import { Model, belongsTo } from 'mirage-server';

export default Model.extend({
  package: belongsTo(),
  title: belongsTo(),
  visibilityData: belongsTo()
});
