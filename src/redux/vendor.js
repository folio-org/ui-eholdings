import Resolver, { Model } from './resolver';

export default class Vendor extends Model {
  static type = 'vendors';
  static path = '/eholdings/jsonapi/vendors';

  static attributes = {
    name: '',
    packagesSelected: 0,
    packagesTotal: 0
  };

  static relationships = {
    packages: { hasMany: true }
  };
}

Resolver.register(Vendor);
