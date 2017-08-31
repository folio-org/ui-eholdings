import ApplicationSerializer from './application';
// import createCustomerResourcesList from '../utils/create-customer-resource-list';

export default ApplicationSerializer.extend({
  include: ['customerResources', 'subjects'],

  modifyKeys(json) {
    let newHash = json;
    newHash.customerResourcesList = this.createCustomerResourcesList(json);
    return newHash;
  }
});
