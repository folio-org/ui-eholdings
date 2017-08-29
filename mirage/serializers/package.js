import { Serializer } from 'mirage-server';

export default Serializer.extend({
  embed: true,

  include: ['customCoverage', 'vendor', 'visibilityData'],

  serialize(response) {
    let json = Serializer.prototype.serialize.apply(this, arguments);
    let keyForPrimaryResource = this.keyForResource(response);
    let unSideloadedJson = json[keyForPrimaryResource];

    if (Array.isArray(unSideloadedJson)) {
      return {
        totalResults: unSideloadedJson.length,
        packagesList: unSideloadedJson.map(this.adjustPackageKeys, this)
      };
    } else {
      return this.adjustPackageKeys(unSideloadedJson);
    }
  },

  adjustPackageKeys(json) {
    // move the vendor id and name up a level
    json.vendorId = json.vendor.id;
    json.vendorName = json.vendor.vendorName;
    delete json.vendor;

    // delete ids of embedded records
    delete json.customCoverage.id;
    delete json.visibilityData.id;

    // rename primary id
    json.packageId = json.id;
    delete json.id;

    return json;
  }
});
