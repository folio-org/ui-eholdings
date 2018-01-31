import model, { hasMany } from './model';

class Package {
  name = '';
  providerId = null;
  providerName = '';
  isSelected = false;
  contentType = '';
  selectedCount = 0;
  titleCount = 0;
  customCoverage = {};
  visibilityData = {};
  customerResources = hasMany();
}

export default model({
  type: 'packages',
  path: '/eholdings/packages'
})(Package);
