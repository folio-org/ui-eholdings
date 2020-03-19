import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: (i) => i,
  type: 'accessTypes',
  attributes: {
    name: faker.random.arrayElement([
      'Trial',
      'Subscription'
    ]),
    description: faker.lorem.words(2),
  },
});
