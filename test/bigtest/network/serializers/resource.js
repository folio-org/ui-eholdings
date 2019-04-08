import ApplicationSerializer from './application';

function mapResourceAttrs(hash, resource) {
  hash.attributes.providerId = resource.package.provider.id;
  hash.attributes.providerName = resource.package.provider.name;
  hash.attributes.packageId = resource.package.id;
  hash.attributes.packageName = resource.package.name;
  hash.attributes.titleId = resource.title.id;
  hash.attributes.name = resource.title.name;

  // these are really title attributes, but have to stick around
  // until /PUT titles is available in mod-kb-ebsco
  hash.attributes.contentType = resource.package.contentType;
  hash.attributes.publisherName = resource.title.publisherName;
  hash.attributes.publicationType = resource.title.publicationType;
  hash.attributes.contributors = resource.title.contributors;
  hash.attributes.identifiers = resource.title.identifiers;
  hash.attributes.subjects = resource.title.subjects;
  hash.attributes.isPeerReviewed = resource.title.isPeerReviewed;
  hash.attributes.edition = resource.title.edition;
  hash.attributes.description = resource.title.description;
  hash.attributes.isTitleCustom = resource.title.isTitleCustom;

  return hash;
}

export default ApplicationSerializer.extend({
  getHashForResource(resource) {
    const hash = ApplicationSerializer.prototype.getHashForResource.apply(this, arguments); // eslint-disable-line prefer-rest-params

    if (Array.isArray(hash)) {
      return hash.map((h, i) => mapResourceAttrs(h, resource.models[i]));
    } else {
      return mapResourceAttrs(hash, resource);
    }
  }
});
