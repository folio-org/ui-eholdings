import { Factory, faker, trait } from '@bigtest/mirage';

export default Factory.extend({
  isSelected: false,
  url: () => faker.internet.url(),
  customCoverages: [],
  coverageStatement: '',
  managedCoverages: [],

  withTitle: trait({
    afterCreate(resource, server) {
      let title = server.create('title', 'withSubjects', 'withContributors', 'withIdentifiers');
      resource.title = title;
      resource.save();
    }
  }),

  withPackage: trait({
    afterCreate(resource, server) {
      let packageObj = server.create('package', 'withProvider');
      resource.update({
        package: packageObj
      });
      resource.save();
    }
  }),

  withManagedCoverage: trait({
    afterCreate(resource, server) {
      let managedCoverages = server.createList('managed-coverage', 1);
      resource.update('managedCoverages', managedCoverages.map(item => item.toJSON()));
      resource.save();
    }
  }),

  isHidden: trait({
    afterCreate(resource, server) {
      let visibilityData = server.create('visibility-data', {
        isHidden: true,
        reason: 'The content is for mature audiences only.'
      });
      resource.update('visibilityData', visibilityData.toJSON());
      resource.save();
    }
  }),

  isHiddenWithoutReason: trait({
    afterCreate(resource, server) {
      let visibilityData = server.create('visibility-data', {
        isHidden: true,
        reason: ''
      });
      resource.update('visibilityData', visibilityData.toJSON());
      resource.save();
    }
  }),

  withProxy: trait({
    afterCreate(resource, server) {
      let proxy = server.create('proxy', {
        inherited: true,
        id: 'bigTestJS'
      });
      resource.update('proxy', proxy.toJSON());
      resource.save();
    }
  }),

  afterCreate(resource, server) {
    if (!resource.visibilityData) {
      let visibilityData = server.create('visibility-data');
      resource.update('visibilityData', visibilityData.toJSON());
      resource.save();
    }

    if (!resource.customEmbargoPeriod) {
      let customEmbargoPeriod = server.create('embargo-period', {
        embargoUnit: '',
        embargoValue: 0
      });
      resource.update('customEmbargoPeriod', customEmbargoPeriod.toJSON());
      resource.save();
    }

    if (!resource.managedEmbargoPeriod) {
      let managedEmbargoPeriod = server.create('embargo-period', {
        embargoUnit: '',
        embargoValue: 0
      });
      resource.update('managedEmbargoPeriod', managedEmbargoPeriod.toJSON());
      resource.save();
    }
  }
});
