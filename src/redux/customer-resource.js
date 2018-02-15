import model, { belongsTo } from './model';

class CustomerResource {
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
}

export default model({
  type: 'customerResources',
  path: '/eholdings/customer-resources'
})(CustomerResource);
