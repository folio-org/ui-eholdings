import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  include: ['package', 'title', 'visibilityData'],

  serialize() {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);

    if (Array.isArray(json.customerResources)) {
      return {
        totalResults: json.totalResults,
        titles: json.customerResources
      };
    } else {
      return json;
    }
  },

  modifyKeys(json) {
    if(json.title) {
      let newHash = json.title;
      newHash.customerResourcesList = this.createCustomerResourcesList(json.title);
      newHash.titleId = json.title.id;
      delete newHash.id;
      return newHash;
    } else {
      return json;
    }
  }
});
