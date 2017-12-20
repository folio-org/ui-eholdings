import { JSONAPISerializer, camelize, pluralize } from 'mirage-server';

export default JSONAPISerializer.extend({
  serializeIds: 'always',

  keyForModel(modelName) {
    return camelize(modelName);
  },

  keyForCollection(modelName) {
    return camelize(modelName);
  },

  keyForAttribute(attr) {
    return camelize(attr);
  },

  keyForRelationship(key) {
    return camelize(key);
  },

  typeKeyForModel(model) {
    return camelize(pluralize(model.modelName));
  }
});
