import model, { hasMany } from './model';

class Title {
  name = '';
  edition = '';
  publisherName = '';
  publicationType = '';
  subjects = [];
  contributors = [];
  identifiers = [];
  resources = hasMany();
  isTitleCustom = false;
  isPeerReviewed = false;
  description = '';

  // only used for title creation
  packageId = '';
}

export default model({
  type: 'titles',
  path: '/eholdings/titles'
})(Title);
