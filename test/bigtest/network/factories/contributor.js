import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  type: () => faker.random.arrayElement([
    'author',
    'editor',
    'illustrator'
  ]),
  contributor: (i) => `Contributor${i}`
});
