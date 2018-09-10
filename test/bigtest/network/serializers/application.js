import { JSONAPISerializer, camelize, pluralize } from '@bigtest/mirage';

export default JSONAPISerializer.extend({
  serializeIds: 'always',

  keyForModel(modelName) {
    /* istanbul ignore next */
    return camelize(modelName);
  },

  keyForCollection(modelName) {
    /* istanbul ignore next */
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
