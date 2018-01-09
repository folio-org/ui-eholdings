import model, { belongsTo } from './model';

class CustomerResource {
  name = '';
  titleId = 0;
  vendorId = 0;
  vendorName = '';
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
  managedEmbargoPeriod = {};
  customEmbargoPeriod = {};
  visibilityData = {};
}

export default model({
  type: 'customerResources',
  path: '/eholdings/customer-resources'
})(CustomerResource);
