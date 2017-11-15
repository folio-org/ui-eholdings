import { Factory, faker, trait } from 'mirage-server';

export default Factory.extend({
  name: () => faker.company.companyName(),
  packagesTotal: 0,
  packagesSelected: 0,

  withPackagesAndTitles: trait({
    afterCreate(vendor, server) {
      // If packagesTotal is greater than zero, we'll auto-create the packages
      // for this vendor here.

      if (vendor.packagesTotal > 0) {
        // Decide how many will be selected if not already (0 to packagesTotal)
        vendor.packagesSelected = vendor.packagesSelected ||
          faker.random.number({ min: 0, max: vendor.packagesTotal });

        server.createList('package', vendor.packagesSelected, 'withTitles', {
          vendor,
          vendorName: vendor.name,
          isSelected: true,
          titleCount: faker.random.number({ min: 1, max: 5 })
        });

        server.createList('package', (vendor.packagesTotal - vendor.packagesSelected), 'withTitles', {
          vendor,
          vendorName: vendor.name,
          isSelected: false,
          titleCount: faker.random.number({ min: 1, max: 5 })
        });
      }
    }
  })
});
