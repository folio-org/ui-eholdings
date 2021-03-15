const buildStripes = (otherProperties = {}) => ({
  actionNames: [],
  clone: buildStripes,
  connect: () => {},
  config: {},
  currency: 'USD',
  hasInterface: () => true,
  hasPerm: () => {},
  locale: 'en-US',
  logger: {
    log: () => {},
  },
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  setBindings: () => {},
  setCurrency: () => {},
  setLocale: () => {},
  setSinglePlugin: () => {},
  setTimezone: () => {},
  setToken: () => {},
  store: {
    getState: () => {},
    dispatch: () => {},
    subscribe: () => {},
    replaceReducer: () => {},
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
  ...otherProperties,
});

export default buildStripes;
