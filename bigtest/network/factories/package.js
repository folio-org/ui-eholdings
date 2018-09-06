import { Factory, faker, trait } from '@bigtest/mirage';

export default Factory.extend({
  name: () => faker.commerce.productName(),
  titleCount: 0,
  isSelected: true,
  selectedCount: 0,
  allowKbToAddTitles: true,
  contentType: () => faker.random.arrayElement([
    'OnlineReference',
    'AggregatedFullText',
    'AbstractAndIndex',
    'eBook',
    'eJournal'
  ]),
  customCoverage: {
    beginCoverage: '',
    endCoverage: ''
  },
  isCustom: false,
  packageType: () => faker.random.arrayElement([
    'Complete',
    'Partial',
    'Variable'
  ]),

  withTitles: trait({
    afterCreate(packageObj, server) {
      // If titleCount is greater than zero, we'll auto-create the package titles
      // for this package here.

      if (packageObj.titleCount > 0) {
        // Decide how many will be selected (0 to titleCount)
        packageObj.selectedCount = faker.random.number({ min: 0, max: packageObj.titleCount });

        server.createList('resource', packageObj.selectedCount, 'withTitle', 'withManagedCoverage', {
          package: packageObj,
          isSelected: true
        });

        server.createList('resource', (packageObj.titleCount - packageObj.selectedCount), 'withTitle', 'withManagedCoverage', {
          package: packageObj,
          isSelected: false
        });
      }
    }
  }),

  withProvider: trait({
    afterCreate(packageObj, server) {
      let provider = server.create('provider');
      packageObj.provider = provider;
      packageObj.save();
    }
  }),

  isHidden: trait({
    afterCreate(packageObj, server) {
      let visibilityData = server.create('visibility-data', {
        isHidden: true,
        reason: 'The content is for mature audiences only.'
      });
      packageObj.update('visibilityData', visibilityData.toJSON());
    }
  }),

  isHiddenWithoutReason: trait({
    afterCreate(packageObj, server) {
      let visibilityData = server.create('visibility-data', {
        isHidden: true,
        reason: ''
      });
      packageObj.update('visibilityData', visibilityData.toJSON());
    }
  }),

  withProxy: trait({
    afterCreate(resource, server) {
      let proxy = server.create('proxy', {
        inherited: false,
        id: 'microstates'
      });
      resource.update('proxy', proxy.toJSON());
      resource.save();
    }
  }),

  withInheritedProxy: trait({
    afterCreate(resource, server) {
      let proxy = server.create('proxy', {
        inherited: true,
        id: 'bigTestJS'
      });
      resource.update('proxy', proxy.toJSON());
      resource.save();
    }
  }),
  withCustomCoverage: trait({
    afterCreate(packageObj, server) {
      let customCoverage = server.create('custom-coverage');
      packageObj.update('customCoverage', customCoverage.toJSON());
    }
  }),

  afterCreate(packageObj, server) {
    if (!packageObj.visibilityData) {
      let visibilityData = server.create('visibility-data');
      packageObj.update('visibilityData', visibilityData.toJSON());
    }
    if (!packageObj.proxy) {
      let proxy = server.create('proxy', {
        inherited: false,
        id: 'bigTestJS'
      });
      packageObj.update('proxy', proxy.toJSON());
      packageObj.save();
    }
  }
});
