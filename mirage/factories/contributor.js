import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  type: () => faker.random.arrayElement([
    'author',
    'editor',
    'illustrator'
  ]),
  contributor: () => `${faker.name.firstName()} ${faker.name.lastName()}`
});
