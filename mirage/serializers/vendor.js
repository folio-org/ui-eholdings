import { JSONAPISerializer, camelize } from 'mirage-server';

export default JSONAPISerializer.extend({
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
  }
});
