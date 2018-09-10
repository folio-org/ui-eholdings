import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  type: () => faker.random.arrayElement([
    'TLI',
    'BISAC'
  ]),
  subject: () => faker.commerce.department()
});
