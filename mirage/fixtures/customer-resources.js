import padStart from 'lodash/padStart';

// related customer resources for the paged package
let packageCustomerResources = new Array(50).fill().map((_, i) => {
  return {
    id: `pkg_cust_${padStart(i, 3, '0')}`,
    titleId: `pkg_title_${padStart(i, 3, '0')}`,
    packageId: 'paged_pkg'
  };
});

// related customer resources for the paged title
let titleCustomerResources = new Array(50).fill().map((_, i) => {
  return {
    id: `title_cust_${padStart(i, 3, '0')}`,
    packageId: `title_pkg_${padStart(i, 3, '0')}`,
    titleId: 'paged_title'
  };
});

export default [
  ...packageCustomerResources,
  ...titleCustomerResources
];
