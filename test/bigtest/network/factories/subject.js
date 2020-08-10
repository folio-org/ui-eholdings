import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  type: () => faker.random.arrayElement([
    'TLI',
    'BISAC'
  ]),
  subject: () => faker.commerce.department()
});
