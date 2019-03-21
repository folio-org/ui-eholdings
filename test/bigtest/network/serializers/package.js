import ApplicationSerializer from './application';

function mapPackageProvider(hash, provider) {
  if (provider) {
    hash.attributes.providerId = provider.id;
    hash.attributes.providerName = provider.name;
  }

  return hash;
}

export default ApplicationSerializer.extend({
  getHashForResource(pkg) {
    const hash = ApplicationSerializer.prototype.getHashForResource.apply(this, arguments); // eslint-disable-line prefer-rest-params

    if (Array.isArray(hash)) {
      return hash.map((h, i) => mapPackageProvider(h, pkg.models[i].provider));
    } else {
      return mapPackageProvider(hash, pkg.provider);
    }
  }
});
