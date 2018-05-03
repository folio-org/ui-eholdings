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
  url = '';
  managedCoverages = [];
  customCoverages = [];
  managedEmbargoPeriod = {};
  customEmbargoPeriod = {};
  visibilityData = {};
  coverageStatement = '';

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
}

export default model({
  type: 'resources',
  path: '/eholdings/resources'
})(Resource);
