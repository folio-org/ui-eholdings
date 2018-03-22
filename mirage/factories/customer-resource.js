import { Factory, faker, trait } from '@bigtest/mirage';

export default Factory.extend({
  isSelected: false,
  url: () => faker.internet.url(),
  customCoverages: [],
  coverageStatement: '',

  withTitle: trait({
    afterCreate(customerResource, server) {
      let title = server.create('title', 'withSubjects', 'withContributors', 'withIdentifiers');
      customerResource.title = title;
      customerResource.save();
    }
  }),

  withPackage: trait({
    afterCreate(customerResource, server) {
      let packageObj = server.create('package', 'withProvider');
      customerResource.update({
        package: packageObj
      });
      customerResource.save();
    }
  }),

  withManagedCoverage: trait({
    afterCreate(customerResource, server) {
      let managedCoverages = server.createList('managed-coverage', 1);
      customerResource.update('managedCoverages', managedCoverages.map(item => item.toJSON()));
      customerResource.save();
    }
  }),

  isHidden: trait({
    afterCreate(customerResource, server) {
      let visibilityData = server.create('visibility-data', {
        isHidden: true,
        reason: 'The content is for mature audiences only.'
      });
      customerResource.update('visibilityData', visibilityData.toJSON());
      customerResource.save();
    }
  }),

  isHiddenWithoutReason: trait({
    afterCreate(customerResource, server) {
      let visibilityData = server.create('visibility-data', {
        isHidden: true,
        reason: ''
      });
      customerResource.update('visibilityData', visibilityData.toJSON());
      customerResource.save();
    }
  }),

  afterCreate(customerResource, server) {
    if (!customerResource.visibilityData) {
      let visibilityData = server.create('visibility-data');
      customerResource.update('visibilityData', visibilityData.toJSON());
      customerResource.save();
    }

    if (!customerResource.customEmbargoPeriod) {
      let customEmbargoPeriod = server.create('embargo-period', {
        embargoUnit: null,
        embargoValue: 0
      });
      customerResource.update('customEmbargoPeriod', customEmbargoPeriod.toJSON());
      customerResource.save();
    }

    if (!customerResource.managedEmbargoPeriod) {
      let managedEmbargoPeriod = server.create('embargo-period', {
        embargoUnit: null,
        embargoValue: 0
      });
      customerResource.update('managedEmbargoPeriod', managedEmbargoPeriod.toJSON());
      customerResource.save();
    }

    if (!customerResource.managedCoverages) {
      let managedCoverages = server.createList('managed-coverage', 1, {
        beginCoverage: null,
        endCoverage: null
      });
      customerResource.update('managedCoverages', managedCoverages.map(item => item.toJSON()));
      customerResource.save();
    }
  }
});
