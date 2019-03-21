import padStart from 'lodash/padStart';

// package with pages of resources
const pagedPackage = {
  id: 'paged_pkg',
  name: 'Paged Package',
  providerId: 'rel_provider',
  resourceIds: new Array(50).fill().map((_, i) => {
    return `pkg_cust_${padStart(i, 3, '0')}`;
  })
};

// related packages for the paged provider
const providerPackages = new Array(50).fill().map((_, i) => {
  return {
    id: `provider_pkg_${padStart(i, 3, '0')}`,
    name: `Provider Package ${i + 1}`,
    providerId: 'paged_provider'
  };
});

// related packages for the paged title resources
const titlePackages = new Array(50).fill().map((_, i) => {
  return {
    id: `title_pkg_${padStart(i, 3, '0')}`,
    name: `Title Package ${i + 1}`,
    providerId: 'rel_provider'
  };
});

export default [
  pagedPackage,
  ...providerPackages,
  ...titlePackages
];
