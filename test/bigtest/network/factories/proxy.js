import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: () => faker.random.arrayElement([
    '<n>',
    'bigTestJS',
    'microstates',
    'EZproxy',
  ]),
  inherited: true
});
