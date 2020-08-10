import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  package: belongsTo(),
  title: belongsTo(),
  accessType: belongsTo(),
});
