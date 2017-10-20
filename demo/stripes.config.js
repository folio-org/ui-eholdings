module.exports = {
  okapi: { url: 'https://okapi.frontside.io', tenant: 'fs' },
  config: {
    hasAllPerms: true,
    logCategories: ''
  },
  modules: {
    '@folio/eholdings': {},
    '../demo': {}
  }
};
