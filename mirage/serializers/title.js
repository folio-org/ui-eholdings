import ApplicationSerializer from './application';
// import createCustomerResourcesList from '../utils/create-customer-resource-list';

export default ApplicationSerializer.extend({
  include: ['customerResources'],

  modifyKeys(json) {
    let newHash = json;
    newHash.customerResourcesList = this.createCustomerResourcesList(json);
    delete newHash.customerResources;
    return newHash;
  }
});
