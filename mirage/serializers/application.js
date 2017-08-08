import { Serializer } from 'mirage-server';

export default Serializer.extend({
  embed: true,
  root: false,

  serialize(response) {
    let json = Serializer.prototype.serialize.apply(this, arguments);
    if(Array.isArray(json)) {
      json = {
        totalResults: json.length,
        [this.keyForResource(response)]: json
      }
    }
    return json;
  }
});
