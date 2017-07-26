import { Factory, faker } from 'mirage-server';

export default Factory.extend({
  vendorId: () => faker.random.number(),
  vendorName: () => faker.company.companyName(),
  vendorToken: null,
  isCustomer: false,
  packagesTotal: 1,
  packagesSelected: 0,
});