import model, { belongsTo } from './model';

class Resource {
  name = '';
  titleId = 0;
  providerId = 0;
  providerName = '';
  packageId = 0;
  packageName = '';
  package = belongsTo();
  title = belongsTo();
  isSelected = false;
  url = null;
  managedCoverages = [];
  customCoverages = [];
  managedEmbargoPeriod = {};
  customEmbargoPeriod = {};
  visibilityData = {};
  coverageStatement = '';
  proxy = {};

  // these are really title attributes, but have to stick around
  // until /PUT titles is available in mod-kb-ebsco
  publisherName = '';
  edition = '';
  publicationType = '';
  contentType = '';
  subjects = [];
  contributors = [];
  identifiers = [];
  isTitleCustom = false;
  isPeerReviewed = false;
  description = '';

  serialize() {
    let data = {
      id: this.id,
      type: this.type,
      attributes: {
        name: this.name,
        titleId: this.titleId,
        providerId: this.providerId,
        providerName: this.providerName,
        packageId: this.packageId,
        packageName: this.packageName,
        isSelected: this.isSelected,
        url: this.url,
        managedCoverages: this.managedCoverages,
        customCoverages: this.customCoverages,
        managedEmbargoPeriod: this.managedEmbargoPeriod,
        customEmbargoPeriod: this.customEmbargoPeriod,
        visibilityData: this.visibilityData,
        coverageStatement: this.coverageStatement,
        proxy: this.proxy,
        publisherName: this.publisherName,
        edition: this.edition,
        publicationType: this.publicationType,
        contentType: this.contentType,
        subjects: this.subjects,
        contributors: this.contributors,
        identifiers: this.identifiers,
        isTitleCustom: this.isTitleCustom,
        isPeerReviewed: this.isPeerReviewed,
        description: this.description,
      }
    };

    return { data };
  }
}

export default model({
  type: 'resources',
  path: '/eholdings/resources'
})(Resource);
