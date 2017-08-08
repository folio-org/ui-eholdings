import { Factory, faker } from 'mirage-server';

export default Factory.extend({
  vendorName: () => faker.company.companyName(),
  packagesTotal: 1,
  packagesSelected: 0
});
