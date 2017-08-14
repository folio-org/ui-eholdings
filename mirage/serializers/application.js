import { Serializer } from 'mirage-server';

export default Serializer.extend({
  embed: false,
  serializeIds: 'always',

  serialize(response) {
    /*
     * Don't rely on mirage to send rootless responses, since a rootless mirage
     * response currently doesn't serialize relationship ids; instead we manually
     * pull out the top-level key and ignore sideloaded records.
    */
    let json = Serializer.prototype.serialize.apply(this, arguments);
    let keyForPrimaryResource = this.keyForResource(response);
    let unSideloadedJson = json[keyForPrimaryResource];

    if (Array.isArray(unSideloadedJson)) {
      return {
        totalResults: unSideloadedJson.length,
        [keyForPrimaryResource]: unSideloadedJson.map(this.mapPrimaryKey, this)
      };
    } else {
      return this.mapPrimaryKey(unSideloadedJson);
    }
  },

  mapPrimaryKey(json) {
    let { id, ...rest } = json;
    return { [`${this.type}Id`]: id, ...rest };
  },

  keyForCollection(modelName) {
    return `${this.keyForModel(modelName)}List`;
  },

  keyForEmbeddedRelationship(attributeName) {
    return `${this.keyForModel(attributeName)}List`;
  }
});
