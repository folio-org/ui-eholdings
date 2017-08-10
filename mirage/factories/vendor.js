import { Factory, faker } from 'mirage-server';

export default Factory.extend({
  vendorName: () => faker.company.companyName(),
  packagesTotal: 0,
  packagesSelected: 0,

  afterCreate(vendor, server) {
    // If packagesTotal is greater than zero, we'll auto-create the packages
    // for this vendor here.

    if(vendor.packagesTotal > 0) {
      // Decide how many will be selected (0-packagesTotal)
      vendor.packagesSelected = Math.floor(Math.random() * (vendor.packagesTotal + 1));

      server.createList('package', vendor.packagesSelected, {
        vendor,
        vendorName: vendor.vendorName,
        isSelected: 1
      });

      server.createList('package', (vendor.packagesTotal - vendor.packagesSelected), {
        vendor,
        vendorName: vendor.vendorName,
        isSelected: 0
      });
    }
  }
});
