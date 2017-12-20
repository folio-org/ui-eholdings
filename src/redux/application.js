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
  type: 'configuration',
  // id is 'configuration' so it will be appended to this path when
  // retrieving the configuration
  path: '/eholdings'
})(
  class Configuration {
    customerId = '';
    apiKey = '';
  }
);
