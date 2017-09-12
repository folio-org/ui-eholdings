import { Factory, faker } from 'mirage-server';

export default Factory.extend({
  embargoUnit: () => faker.random.arrayElement([
    'Days',
    'Weeks',
    'Months',
    'Years'
  ]),
  embargoValue: () => faker.random.number({ min: 0, max: 7 })
});
