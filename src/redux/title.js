import Resolver, { Model } from './resolver';

export default class Title extends Model {
  static type = 'titles';
  static path = '/eholdings/jsonapi/titles';

  static attributes = {
    name: '',
    publisherName: '',
    publicationType: '',
    subjects: [],
    contributors: [],
    identifiers: []
  };

  static relationships = {
    customerResources: { hasMany: true }
  };
}

Resolver.register(Title);
