import { Serializer, pluralize } from 'mirage-server';

export default Serializer.extend({
  embed: true,

  serialize(response) {
    /*
     * Don't rely on mirage to send rootless responses, since a rootless mirage
     * response currently doesn't serialize relationship ids; instead we manually
     * pull out the top-level key.
    */
    let json = Serializer.prototype.serialize.apply(this, arguments);
    let keyForPrimaryResource = this.keyForResource(response);
    let rootlessJson = json[keyForPrimaryResource];

    if(typeof this.serializerFor(response.modelName).modifyKeys === "function") {
      if (Array.isArray(rootlessJson)) {
        rootlessJson = rootlessJson.map(this.serializerFor(response.modelName).modifyKeys, this);
      } else {
        rootlessJson = this.serializerFor(response.modelName).modifyKeys(rootlessJson);
      }
    }

    if (Array.isArray(rootlessJson)) {
      return {
        totalResults: rootlessJson.length,
        [keyForPrimaryResource]: rootlessJson.map(this.mapPrimaryKey, this)
      };
    } else {
      return this.mapPrimaryKey(rootlessJson);
    }
  },

  mapPrimaryKey(json) {
    let { id, ...rest } = json;
    return { [`${this.type}Id`]: id, ...rest };
  },

  keyForCollection(modelName) {
    const pluralizedKey = pluralize(this.keyForModel(modelName));

    if (modelName === 'vendor' || modelName === 'title' || modelName === 'customer-resource') {
      return pluralizedKey;
    } else {
      return `${pluralizedKey}List`;
    }
  },

  keyForEmbeddedRelationship(attributeName) {
    let attributeNamesToAppendList = ['customerResources', 'subjects', 'identifiers', 'contributors'];

    if(attributeNamesToAppendList.includes(attributeName)) {
      return `${pluralize(attributeName)}List`;
    } else {
      return attributeName;
    }
  },

  createCustomerResourcesList(json) {
    // move the vendor/package/title ids and names up a level
    return json.customerResourcesList.map((customerResource) => {
      let hash = customerResource;
      hash.vendorId = customerResource.package.vendor.id;
      hash.vendorName = customerResource.package.vendor.vendorName;
      hash.packageId = customerResource.package.id;
      hash.packageName = customerResource.package.packageName;
      hash.contentType = customerResource.package.contentType;
      hash.titleId = json.titleId;
      delete hash.package;
      delete hash.id;
      return hash;
    });
  }
});
