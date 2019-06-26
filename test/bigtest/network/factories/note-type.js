import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: () => faker.random.uuid(),
  name: () => faker.commerce.productName(),
  metadata: {
    createdByUserId: () => faker.random.uuid(),
    createdByUsername: () => faker.name.firstName(),
    createdDate: () => faker.date.past(2),
    updatedByUserId: () => faker.random.uuid(),
    updatedDate: () => faker.date.past(1),
  },
  usage: {
    noteTotal: 0
  },
});
