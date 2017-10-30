import { Factory, faker, trait } from 'mirage-server';

export default Factory.extend({
  isSelected: false,
  url: () => faker.internet.url(),

  withTitle: trait({
    afterCreate(customerResource, server) {
      let title = server.create('title', 'withSubjects', 'withContributors', 'withIdentifiers');
      customerResource.title = title;
      customerResource.save();
    }
  }),

  withPackage: trait({
    afterCreate(customerResource, server) {
      let packageObj = server.create('package', 'withVendor');
      customerResource.update({
        package: packageObj
      });
      customerResource.save();
    }
  }),

  isHidden: trait({
    afterCreate(customerResource, server) {
      let visibilityData = server.create('visibility-data', {
        isHidden: true,
        reason: 'The content is for mature audiences only.'
      });
      customerResource.update('visibilityData', visibilityData);
      customerResource.save();
    }
  }),

  // withManagedCoverage: trait({
  //   afterCreate(customerResource, server) {
  //     console.log('customResource', customerResource);
  //     let managedCoverages = server.createList('managed-coverage', 3);
  //     customerResource.managedCoverageList = managedCoverages;
  //     customerResource.save();
  //   }
  // }),
  afterCreate(customerResource, server) {
    if (!customerResource.visibilityData) {
      let visibilityData = server.create('visibility-data');
      customerResource.update('visibilityData', visibilityData);
      customerResource.save();
    }

    if (!customerResource.customEmbargoPeriod) {
      let customEmbargoPeriod = server.create('embargo-period', {
        embargoUnit: null,
        embargoValue: 0
      });
      customerResource.update('customEmbargoPeriod', customEmbargoPeriod);
      customerResource.save();
    }

    if (!customerResource.managedEmbargoPeriod) {
      let managedEmbargoPeriod = server.create('embargo-period', {
        embargoUnit: null,
        embargoValue: 0
      });
      customerResource.update('managedEmbargoPeriod', managedEmbargoPeriod);
      customerResource.save();
    }

    if (!customerResource.managedCoverageList) {
      let managedCoverages = server.createList('managed-coverage', 3);
      customerResource.update('managedCoverageList', managedCoverages);
      customerResource.save();
    }
  }
});
