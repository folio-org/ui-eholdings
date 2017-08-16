import { Factory, faker, trait } from 'mirage-server';

export default Factory.extend({
  isSelected: false,
  url: () => faker.internet.url(),

  withTitle: trait({
    afterCreate(customerResource, server) {
      let title = server.create('title');
      customerResource.title = title;
      customerResource.save();
    }
  }),

  withPackage: trait({
    afterCreate(customerResource, server) {
      let packageObj = server.create('package', 'withVendor');
      customerResource.update({
        'package': packageObj,
        'packageName': packageObj.packageName,
        'vendorId': packageObj.vendor.id,
        'vendorName': packageObj.vendor.vendorName
      });
      customerResource.save();
    }
  }),

  afterCreate(customerResource) {
    if(customerResource.package) {
      customerResource.update({
        'packageName': customerResource.package.packageName,
        'vendorId': customerResource.package.vendor.id,
        'vendorName': customerResource.package.vendor.vendorName
      });
      customerResource.save();
    }
  }
});
