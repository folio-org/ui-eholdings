import { Factory, faker, trait } from 'mirage-server';

export default Factory.extend({
  vendorName: () => faker.company.companyName(),
  packagesTotal: 0,
  packagesSelected: 0,

  withPackagesAndTitles: trait({
    afterCreate(vendor, server) {
      // If packagesTotal is greater than zero, we'll auto-create the packages
      // for this vendor here.

      if(vendor.packagesTotal > 0) {
        // Decide how many will be selected (0 to packagesTotal)
        vendor.packagesSelected = faker.random.number({ min: 0, max: vendor.packagesTotal });

        server.createList('package', vendor.packagesSelected, 'withTitles', {
          vendor,
          vendorName: vendor.vendorName,
          isSelected: true,
          titleCount: faker.random.number({ min: 1, max: 5 })
        });

        server.createList('package', (vendor.packagesTotal - vendor.packagesSelected), 'withTitles', {
          vendor,
          vendorName: vendor.vendorName,
          isSelected: false,
          titleCount: faker.random.number({ min: 1, max: 5 })
        });
      }
    }
  })
});
