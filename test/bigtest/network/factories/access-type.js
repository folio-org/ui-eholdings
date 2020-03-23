import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  name: (i) => `my custom type ${i + 1}`,
  description: faker.lorem.words(2),
});
