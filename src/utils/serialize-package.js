export const serializePackageAttributes = (values = {}) => {
  const attributes = {
    name: values.name,
    isSelected: values.isSelected,
    allowKbToAddTitles: values.allowKbToAddTitles,
    contentType: values.contentType,
    customCoverage: values.customCoverage,
    visibility: values.visibility,
    isCustom: values.isCustom,
    proxy: values.proxy,
    packageToken: values.packageToken,
    isFullPackage: values.isSelected && !values.isPartiallySelected,
    accessTypeId: values.accessTypeId,
    customAltNames: values.customAltNames,
    customDisplayName: values.customDisplayName,
    customDescription: values.customDescription,
  };

  if (values.isCustom) {
    attributes.url = values.url;
    attributes.isFreeAccess = values.isFreeAccess;
  }

  return attributes;
};
