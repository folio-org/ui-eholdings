import packageJson from '../package.json';

const { type, ...stripeDefaults } = packageJson.stripes;

export const modules = {
  app: [{
      ...stripeDefaults,
      module: '@folio/eholdings',
      getModule: () => require('../src/index.js').default,
      // moduleRoot: path.join(__dirname, '..'),
      description: packageJson.description,
      version: packageJson.version
    }]
};

export const okapi = { url: 'https://okapi.com', tenant:'tests' };

export const config = {
  // autoLogin: { username: 'diku_admin', password: 'admin' }
  // logCategories: 'core,redux,connect,connect-fetch,substitute,path,mpath,mquery,action,event,perm,interface,xhr'
  logCategories: '',
  // logPrefix: 'stripes'
  // logTimestamp: false
  // showPerms: false
  // listInvisiblePerms: false
  hasAllPerms: true,
  // softLogout: false
  disableAuth: true
};

export default { okapi, config, modules };
