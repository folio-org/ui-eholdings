import { Serializer } from 'mirage-server';

export default Serializer.extend({
  serialize(response, request) {
    let json = Serializer.prototype.serialize.apply(this, arguments);
    json.totalResults = json[this.keyForResource(response)].length;
    return json;
  }
});
