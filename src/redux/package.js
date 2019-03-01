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
  resources = hasMany();
  isCustom = false;
  packageType = '';
  proxy = {};
  packageToken = {};
  tags = {
    tagList: []
  };

  get isPartiallySelected() {
    return this.selectedCount > 0 && this.selectedCount !== this.titleCount;
  }

  get isInFlight() {
    return this.destroy.isPending || (this.update.isPending && ('selectedCount' in this.update.changedAttributes));
  }
}

export default model({
  type: 'packages',
  path: '/eholdings/packages'
})(Package);
