import PackageSerializer from './package';

// commented attributes are ommitted from our real server
export default PackageSerializer.extend({
  attrs: [
    'name',
    'providerId',
    'providerName',
    'isSelected',
    // 'allowKbToAddTitles',
    'contentType',
    'selectedCount',
    'titleCount',
    'customCoverage',
    'visibilityData',
    'isCustom',
    'packageType',
    // 'proxy',
    // 'packageToken'
  ]
});
