import { Factory, faker, trait } from 'mirage-server';

export default Factory.extend({
  isSelected: false,
  url: () => faker.internet.url(),

  withTitle: trait({
    afterCreate(customerResource, server) {
      let title = server.create('title');
      customerResource.update('title', title);
    }
  })
});
