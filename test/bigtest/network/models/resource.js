import { Model, belongsTo } from '@bigtest/mirage';

export default Model.extend({
  package: belongsTo(),
  title: belongsTo(),
  accessType: belongsTo(),
});
