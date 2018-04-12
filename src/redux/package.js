import model, { hasMany } from './model';

class Package {
  name = '';
  providerId = null;
  providerName = '';
  isSelected = false;
  allowKbToAddTitles = null; // This could default to false after RM API starts sending this attribute in packages list to mod-kb-ebsco
  contentType = '';
  selectedCount = 0;
  titleCount = 0;
  customCoverage = {};
  visibilityData = {};
  customerResources = hasMany();
  isCustom = false;
  packageType = '';
}

export default model({
  type: 'packages',
  path: '/eholdings/packages'
})(Package);
