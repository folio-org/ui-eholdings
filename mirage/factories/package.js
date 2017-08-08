import { Factory, faker } from 'mirage-server';

export default Factory.extend({
  packageId: () => faker.random.number(),
  packageName: () => faker.commerce.productName(),
  titleCount: 1,
  isSelected: 0,
  selectedCount: 1,
  contentType: () => Math.floor(Math.random() * 8), // valid values: 0-7
});
