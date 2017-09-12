import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  include: ['contributors', 'customerResources', 'subjects', 'identifiers'],

  modifyKeys(json) {
    let newHash = json;
    newHash.customerResourcesList = this.createCustomerResourcesList(json);
    return newHash;
  }
});
