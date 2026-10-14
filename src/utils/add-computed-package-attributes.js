// this function, at this moment, exists to add the `isFullPackage` property
// which doesn't exist as a form input value, but is determined from other properties

export const addComputedPackageAttributes = (values = {}) => {
  const attributes = {
    ...values,
    isFullPackage: values.isSelected && !values.isPartiallySelected,
  };

  return attributes;
};
