import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  include: ['customCoverage', 'vendor', 'visibilityData'],

  modifyKeys(json) {
    let newHash = json;
    if (newHash.vendor && !newHash.vendorId) {
      newHash.vendorId = json.vendor.id;
      newHash.vendorName = json.vendor.vendorName;
      delete newHash.vendor;
    }
    return newHash;
  }
});
