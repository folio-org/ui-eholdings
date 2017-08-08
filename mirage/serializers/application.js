import { Serializer } from 'mirage-server';

export default Serializer.extend({
  embed: true,
  root: false,

  serialize(response) {
    let json = Serializer.prototype.serialize.apply(this, arguments);
    if(Array.isArray(json)) {
      return {
        totalResults: json.length,
        [this.keyForResource(response)]: json.map(this.mapPrimaryKey, this)
      };
    } else {
      return this.mapPrimaryKey(json);
    }
  },

  mapPrimaryKey(json) {
    let { id, ...rest } = json;
    return { [`${this.type}Id`]: id, ...rest };
  }
});
