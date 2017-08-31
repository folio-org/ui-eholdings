import { Factory, faker } from 'mirage-server';

export default Factory.extend({
  type: () => faker.random.arrayElement([
    'TLI',
    'BISAC'
  ]),
  subject: () => faker.commerce.department()
});
