const environment = process.env.NODE_ENV;
let url;

if (environment === 'production') {
  url = 'https://okapi.frontside.io';
} else {
  url = 'https://okapi-sandbox.frontside.io';
}

module.exports = {
  okapi: { url, tenant: 'fs' },
  config: {
    hasAllPerms: true,
    logCategories: ''
  },
  modules: {
    '@folio/eholdings': {},
    '../demo': {}
  }
};
