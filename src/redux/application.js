import model from './model';

export const Status = model({
  type: 'statuses',
  // id is 'status' so it will be appended to this when retrieving
  // the status
  path: '/eholdings'
})(
  class Status {
    isConfigurationValid = false;
  }
);

export const Configuration = model({
  type: 'configurations',
  // id is 'configuration' so it will be appended to this path when
  // retrieving the configuration
  path: '/eholdings'
})(
  class Configuration {
    customerId = '';
    apiKey = '';
  }
);

export const ProxyType = model({
  type: 'proxyTypes',
  path: '/eholdings/proxy-types'
})(
  class ProxyType {
    id = '';
    name = '';
    urlMask = '';
  }
);

export const RootProxy = model({
  type: 'rootProxies',
  path: '/eholdings'
})(
  class RootProxy {
    id = '';
    proxyTypeId = '';
  }
);

