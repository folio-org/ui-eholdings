import model, { belongsTo } from './model';

class Resource {
  name = '';
  titleId = 0;
  providerId = 0;
  providerName = '';
  packageId = 0;
  packageName = '';
  package = belongsTo();
  publisherName = '';
  publicationType = '';
  contentType = '';
  isSelected = false;
  url = '';
  subjects = [];
  contributors = [];
  identifiers = [];
  managedCoverages = [];
  customCoverages = [];
  managedEmbargoPeriod = {};
  customEmbargoPeriod = {};
  visibilityData = {};
  coverageStatement = '';
  isTitleCustom = false;
}

export default model({
  type: 'resources',
  path: '/eholdings/resources'
})(Resource);
