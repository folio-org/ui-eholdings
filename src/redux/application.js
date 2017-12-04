import Resolver, { Model } from './resolver';

export class Status extends Model {
  static type = 'statuses';
  // id is 'status' so it will be appended to this when retrieving
  // the status
  static path = '/eholdings';

  static attributes = {
    isConfigurationValid: false
  };
}

Resolver.register(Status);

export class Configuration extends Model {
  static type = 'configuration';
  // id is 'configuration' so it will be appended to this path when
  // retrieving the configuration
  static path = '/eholdings';

  static attributes = {
    customerId: '',
    apiKey: ''
  };
}

Resolver.register(Configuration);
