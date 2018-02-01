import ApplicationSerializer from './application';

function mapCustomerResourceAttrs(hash, customerResource) {
  hash.attributes.providerId = customerResource.package.provider.id;
  hash.attributes.providerName = customerResource.package.provider.name;
  hash.attributes.packageId = customerResource.package.id;
  hash.attributes.packageName = customerResource.package.name;
  hash.attributes.contentType = customerResource.package.contentType;
  hash.attributes.titleId = customerResource.title.id;
  hash.attributes.name = customerResource.title.name;
  hash.attributes.publisherName = customerResource.title.publisherName;
  hash.attributes.publicationType = customerResource.title.publicationType;
  hash.attributes.contributors = customerResource.title.contributors;
  hash.attributes.identifiers = customerResource.title.identifiers;
  return hash;
}

export default ApplicationSerializer.extend({
  getHashForResource(customerResource) {
    let hash = ApplicationSerializer.prototype.getHashForResource.apply(this, arguments); // eslint-disable-line prefer-rest-params

    if (Array.isArray(hash)) {
      return hash.map((h, i) => mapCustomerResourceAttrs(h, customerResource.models[i]));
    } else {
      return mapCustomerResourceAttrs(hash, customerResource);
    }
  }
});
