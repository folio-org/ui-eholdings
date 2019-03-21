import padStart from 'lodash/padStart';

// provider with pages of packages
const pagedProvider = {
  id: 'paged_provider',
  name: 'Paged Provider',
  packageIds: new Array(50).fill().map((_, i) => {
    return `provider_pkg_${padStart(i, 3, '0')}`;
  })
};

// related provider for the paged package and paged title
const relatedProvider = {
  id: 'rel_provider',
  name: 'Related Provider'
};

export default [
  pagedProvider,
  relatedProvider
];
