import ApplicationSerializer from './application';

function mapPackageVendor(hash, vendor) {
  if (vendor) {
    hash.attributes.vendorId = vendor.id;
    hash.attributes.vendorName = vendor.name;
  }

  return hash;
}

export default ApplicationSerializer.extend({
  getHashForResource(pkg) {
    let hash = ApplicationSerializer.prototype.getHashForResource.apply(this, arguments); // eslint-disable-line prefer-rest-params

    if (Array.isArray(hash)) {
      return hash.map((h, i) => mapPackageVendor(h, pkg.models[i].vendor));
    } else {
      return mapPackageVendor(hash, pkg.vendor);
    }
  }
});
