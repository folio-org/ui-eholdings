import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: () => faker.random.uuid(),
  subtype: () => faker.random.number({ min: 0, max: 7 }),
  type: () => faker.random.number({ min: 0, max: 9 })
});
