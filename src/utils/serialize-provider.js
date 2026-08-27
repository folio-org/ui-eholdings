export const serializeProviderAttributes = (values = {}) => {
  return {
    packagesSelected: values.packagesSelected || 0,
    proxy: values.proxy || {},
    providerToken: values.providerToken || {},
  };
};
