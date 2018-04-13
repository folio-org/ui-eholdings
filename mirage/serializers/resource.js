import ApplicationSerializer from './application';

function mapResourceAttrs(hash, resource) {
  hash.attributes.providerId = resource.package.provider.id;
  hash.attributes.providerName = resource.package.provider.name;
  hash.attributes.packageId = resource.package.id;
  hash.attributes.packageName = resource.package.name;
  hash.attributes.contentType = resource.package.contentType;
  hash.attributes.titleId = resource.title.id;
  hash.attributes.name = resource.title.name;
  hash.attributes.publisherName = resource.title.publisherName;
  hash.attributes.publicationType = resource.title.publicationType;
  hash.attributes.contributors = resource.title.contributors;
  hash.attributes.identifiers = resource.title.identifiers;
  hash.attributes.subjects = resource.title.subjects;
  return hash;
}

export default ApplicationSerializer.extend({
  getHashForResource(resource) {
    let hash = ApplicationSerializer.prototype.getHashForResource.apply(this, arguments); // eslint-disable-line prefer-rest-params

    if (Array.isArray(hash)) {
      return hash.map((h, i) => mapResourceAttrs(h, resource.models[i]));
    } else {
      return mapResourceAttrs(hash, resource);
    }
  }
});
