import model, { hasMany } from './model';

class Title {
  name = '';
  publisherName = '';
  publicationType = '';
  subjects = [];
  contributors = [];
  identifiers = [];
  resources = hasMany();
}

export default model({
  type: 'titles',
  path: '/eholdings/titles'
})(Title);
