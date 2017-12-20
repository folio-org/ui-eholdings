import model, { hasMany } from './model';

class Package {
  name = '';
  vendorId = null;
  vendorName = '';
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
