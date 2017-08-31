import { Factory, faker, trait } from 'mirage-server';

export default Factory.extend({
  isSelected: false,
  url: () => faker.internet.url(),

  withTitle: trait({
    afterCreate(customerResource, server) {
      let title = server.create('title', 'withSubjects');
      customerResource.title = title;
      customerResource.save();
    }
  }),

  withPackage: trait({
    afterCreate(customerResource, server) {
      let packageObj = server.create('package', 'withVendor');
      customerResource.update({
        'package': packageObj
      });
      customerResource.save();
    }
  })
});
