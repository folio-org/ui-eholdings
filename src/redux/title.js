import model, { hasMany } from './model';

class Title {
  name = '';
  publisherName = '';
  publicationType = '';
  subjects = [];
  contributors = [];
  identifiers = [];
  customerResources = hasMany();
}

export default model({
  type: 'titles',
  path: '/eholdings/titles'
})(Title);
