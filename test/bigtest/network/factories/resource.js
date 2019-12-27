import { Factory, faker, trait } from '@bigtest/mirage';

export default Factory.extend({
  isSelected: false,
  url: () => faker.internet.url(),
  customCoverages: [],
  coverageStatement: '',
  managedCoverages: [],
  tags: {
    tagList: [],
  },
  isTitleCustom: false,
  userDefinedField1: () => faker.lorem.words(),
  userDefinedField2: () => faker.lorem.words(),
  userDefinedField3: () => faker.lorem.words(),

  withTitle: trait({
    afterCreate(resource, server) {
      const title = server.create('title', 'withSubjects', 'withContributors', 'withIdentifiers');
      resource.title = title;
      resource.save();
    }
  }),

  withPackage: trait({
    afterCreate(resource, server) {
      const packageObj = server.create('package', 'withProvider');
      resource.update({
        package: packageObj
      });
      resource.save();
    }
  }),

  withManagedCoverage: trait({
    afterCreate(resource, server) {
      const managedCoverages = server.createList('managed-coverage', 1);
      resource.update('managedCoverages', managedCoverages.map(item => item.toJSON()));
      resource.save();
    }
  }),

  isHidden: trait({
    afterCreate(resource, server) {
      const visibilityData = server.create('visibility-data', {
        isHidden: true,
        reason: 'The content is for mature audiences only.'
      });
      resource.update('visibilityData', visibilityData.toJSON());
      resource.save();
    }
  }),

  isHiddenWithoutReason: trait({
    afterCreate(resource, server) {
      const visibilityData = server.create('visibility-data', {
        isHidden: true,
        reason: ''
      });
      resource.update('visibilityData', visibilityData.toJSON());
      resource.save();
    }
  }),

  withProxy: trait({
    afterCreate(resource, server) {
      const proxy = server.create('proxy', {
        inherited: false,
        id: 'microstates'
      });
      resource.update('proxy', proxy.toJSON());
      resource.save();
    }
  }),

  withInheritedProxy: trait({
    afterCreate(resource, server) {
      const proxy = server.create('proxy', {
        inherited: true,
        id: 'bigTestJS'
      });
      resource.update('proxy', proxy.toJSON());
      resource.save();
    }
  }),

  withTitleCustom: trait({
    afterCreate(resource) {
      resource.update({
        isTitleCustom: true,
        isSelected: true,
      });
      resource.save();
    }
  }),

  afterCreate(resource, server) {
    if (!resource.visibilityData) {
      const visibilityData = server.create('visibility-data');
      resource.update('visibilityData', visibilityData.toJSON());
      resource.save();
    }

    if (!resource.customEmbargoPeriod) {
      const customEmbargoPeriod = server.create('embargo-period', {
        embargoUnit: '',
        embargoValue: 0
      });
      resource.update('customEmbargoPeriod', customEmbargoPeriod.toJSON());
      resource.save();
    }

    if (!resource.managedEmbargoPeriod) {
      const managedEmbargoPeriod = server.create('embargo-period', {
        embargoUnit: '',
        embargoValue: 0
      });
      resource.update('managedEmbargoPeriod', managedEmbargoPeriod.toJSON());
      resource.save();
    }
    if (!resource.proxy) {
      const proxy = server.create('proxy', {
        inherited: false,
        id: 'bigTestJS'
      });
      resource.update('proxy', proxy.toJSON());
      resource.save();
    }
  }
});
