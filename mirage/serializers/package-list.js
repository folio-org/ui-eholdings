import PackageSerializer from './package';

export default PackageSerializer.extend({
  attrs: [
    'name',
    'providerId',
    'providerName',
    'isSelected',
    'contentType',
    'selectedCount',
    'titleCount',
    'customCoverage',
    'visibilityData',
    'isCustom',
    'packageType'
  ]
});
