import { Factory, faker } from 'mirage-server';

export default Factory.extend({
  packageName: () => faker.commerce.productName(),
  titleCount: 1,
  isSelected: true,
  selectedCount: 1,
  contentType: () => faker.random.arrayElement([
    'Online Reference',
    'Aggregated Full Text',
    'Abstract and Index',
    'E-Book',
    'E-Journal'
  ])
});
