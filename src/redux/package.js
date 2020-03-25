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
  accessTypeId = null;
  tags = {
    tagList: []
  };

  serialize() {
    const data = {
      id: this.id,
      type: this.type,
      attributes: {},
    };
    const isNewPackage = !this.id;

    if (isNewPackage) {
      for (const attr of Object.keys(this.data.attributes)) {
        data.attributes[attr] = this[attr];
      }
    } else {
      data.attributes = {
        name: this.name,
        isSelected: this.isSelected,
        allowKbToAddTitles: this.allowKbToAddTitles,
        contentType: this.contentType,
        customCoverage: this.customCoverage,
        visibilityData: this.visibilityData,
        isCustom: this.isCustom,
        proxy: this.proxy,
        packageToken: this.packageToken,
        isFullPackage: this.isSelected && !this.isPartiallySelected,
        accessTypeId: this.accessTypeId,
      };
    }

    return { data };
  }

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
