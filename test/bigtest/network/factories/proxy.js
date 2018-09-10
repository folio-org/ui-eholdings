import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: () => faker.random.arrayElement([
    '<n>',
    'bigTestJS',
    'microstates'
  ]),
  inherited: true
});
