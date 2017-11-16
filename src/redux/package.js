import Resolver, { Model } from './resolver';

export default class Package extends Model {
  static type = 'packages';
  static path = '/eholdings/jsonapi/packages';

  static attributes = {
    name: '',
    vendorId: null,
    vendorName: '',
    isSelected: false,
    contentType: '',
    selectedCount: 0,
    titleCount: 0,
    customCoverage: {},
    visibilityData: {}
  };

  static relationships = {
    customerResources: { hasMany: true }
  };
}

Resolver.register(Package);
