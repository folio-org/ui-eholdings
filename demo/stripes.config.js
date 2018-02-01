const environment = process.env.NODE_ENV;
let url;

if (environment === 'sandbox') {
  url = 'https://okapi-sandbox.frontside.io';
} else {
  url = 'https://okapi.frontside.io';
}

module.exports = {
  // This could be set here or in a .stripesclirc file
  okapi: { url, tenant: 'fs' },
  config: {
    hasAllPerms: true,
    logCategories: ''
  },
  modules: {
    '@folio/eholdings-demo': {},
  },
  branding: {
    logo: {
      src: './demo/frontside-logo.svg',
      alt: 'Frontside'
    },
    favicon: {
      src: './demo/favicon.ico',
    }
  }
};
