import Resolver, { Model } from './resolver';

export default class CustomerResource extends Model {
  static type = 'customerResources';
  static path = '/eholdings/jsonapi/customer-resources';

  static attributes = {
    name: '',
    titleId: 0,
    vendorId: 0,
    vendorName: '',
    packageId: 0,
    packageName: '',
    publisherName: '',
    publicationType: '',
    contentType: '',
    isSelected: false,
    url: '',
    subjects: [],
    contributors: [],
    identifiers: [],
    managedCoverages: [],
    managedEmbargoPeriod: {},
    customEmbargoPeriod: {},
    visibilityData: {}
  };
}

Resolver.register(CustomerResource);
