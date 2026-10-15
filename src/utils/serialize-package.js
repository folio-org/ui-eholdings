// this function, at this moment, exists to add the `isFullPackage` property
// which doesn't exist as a form input value, but is determined from other properties
// as well as removing some managed properties like `isAvailableForSelection`, `managedDescription` etc
// which shouldn't be sent to BE as they're not editable

// any formatting changes to editable values should be done in `populatePackageAttributesFromForm` function

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
    url: values.url,
    isFreeAccess: values.isFreeAccess,
  };

  return attributes;
};
