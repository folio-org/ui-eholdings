import { Factory, faker, trait } from 'mirage-server';

export default Factory.extend({
  packageName: () => faker.commerce.productName(),
  titleCount: 0,
  isSelected: true,
  selectedCount: 0,
  contentType: () => faker.random.arrayElement([
    'Online Reference',
    'Aggregated Full Text',
    'Abstract and Index',
    'E-Book',
    'E-Journal'
  ]),

  withTitles: trait({
    afterCreate(packageObj, server) {
      // If titleCount is greater than zero, we'll auto-create the package titles
      // for this package here.

      if(packageObj.titleCount > 0) {
        // Decide how many will be selected (0 to titleCount)
        packageObj.selectedCount = faker.random.number({ min: 0, max: packageObj.titleCount });

        server.createList('customer-resource', packageObj.selectedCount, 'withTitle', {
          package: packageObj,
          isSelected: true
        });

        server.createList('customer-resource', (packageObj.titleCount - packageObj.selectedCount), 'withTitle', {
          package: packageObj,
          isSelected: false
        });
      }
    }
  }),

  withVendor: trait({
    afterCreate(packageObj, server) {
      let vendor = server.create('vendor');
      packageObj.vendor = vendor;
      packageObj.save();
    }
  }),

  afterCreate(packageObj) {
    if(packageObj.vendor) {
      packageObj.update('vendorName', packageObj.vendor.vendorName).save();
    }
  }
});
