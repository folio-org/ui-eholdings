import padStart from 'lodash/padStart';

// title with pages of customer resources
let pagedTitle = {
  id: 'paged_title',
  name: 'Paged Title',
  customerResourceIds: new Array(50).fill().map((_, i) => {
    return `title_cust_${padStart(i, 3, '0')}`;
  })
};

// related titles for the paged package customer resources
let packageTitles = new Array(50).fill().map((_, i) => {
  return {
    id: `pkg_title_${padStart(i, 3, '0')}`,
    name: `Package Title ${i + 1}`
  };
});

export default [
  pagedTitle,
  ...packageTitles
];
