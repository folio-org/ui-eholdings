const path = require('path');

module.exports = {
  okapi: { 'url':'https://okapi.frontside.io', 'tenant':'fs' },
  config: {
    hasAllPerms: true,
    disableAuth: true,
    logCategories: ''
  },
  modules: {
    '@folio/eholdings': {},
    [path.dirname(__filename)]: {}
  }
};
