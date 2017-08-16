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

  afterCreate(customerResource) {
    customerResource.update('packageName', customerResource.package.packageName);
    customerResource.update('vendorName', customerResource.package.vendor.vendorName);
    customerResource.update('vendorId', customerResource.package.vendor.id);
  }
});
