import { Factory } from '@bigtest/mirage';

export default Factory.extend({
  // these faker methods are currently not used, by removing them we
  // can increase the code coverage of this file by 100%

  // embargoUnit: () => faker.random.arrayElement([
  //   'Days',
  //   'Weeks',
  //   'Months',
  //   'Years'
  // ]),
  // embargoValue: () => faker.random.number({ min: 0, max: 7 })
});
