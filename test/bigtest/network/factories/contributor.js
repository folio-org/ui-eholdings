import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  type: () => faker.random.arrayElement([
    'author',
    'editor',
    'illustrator'
  ]),
  contributor: (i) => `Contributor${i}`
});
