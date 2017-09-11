import { Factory, faker, trait } from 'mirage-server';

export default Factory.extend({
  isSelected: false,
  url: () => faker.internet.url(),

  withTitle: trait({
    afterCreate(customerResource, server) {
      let title = server.create('title', 'withSubjects', 'withIdentifiers');
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
  }),

  isHidden: trait({
    afterCreate(customerResource, server) {
      let visibilityData = server.create('visibility-data', {
        isHidden: true,
        reason: "The content is for mature audiences only."
      });
      customerResource.update('visibilityData', visibilityData);
      customerResource.save();
    }
  }),

  afterCreate(customerResource, server) {
    if(!customerResource.visibilityData) {
      let visibilityData = server.create('visibility-data');
      customerResource.update('visibilityData', visibilityData);
      customerResource.save();
    }
  }
});
