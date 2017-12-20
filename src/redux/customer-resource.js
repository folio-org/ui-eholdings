import model from './model';

class CustomerResource {
  name = '';
  titleId = 0;
  vendorId = 0;
  vendorName = '';
  packageId = 0;
  packageName = '';
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
  path: '/eholdings/jsonapi/customer-resources'
})(CustomerResource);
