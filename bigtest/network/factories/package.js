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

  withProxy: trait({
    afterCreate(pkg, server) {
      let proxy = server.create('proxy', {
        inherited: false,
        id: 'microstates'
      });
      pkg.update('proxy', proxy.toJSON());
      pkg.save();
    }
  }),

  withInheritedProxy: trait({
    afterCreate(pkg, server) {
      let proxy = server.create('proxy', {
        inherited: true,
        id: 'bigTestJS'
      });
      pkg.update('proxy', proxy.toJSON());
      pkg.save();
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
    afterCreate(packageObj, server) {
      let proxy = server.create('proxy', {
        inherited: false,
        id: 'microstates'
      });
      packageObj.update('proxy', proxy.toJSON());
      packageObj.save();
    }
  }),

  withInheritedProxy: trait({
    afterCreate(packageObj, server) {
      let proxy = server.create('proxy', {
        inherited: true,
        id: 'bigTestJS'
      });
      packageObj.update('proxy', proxy.toJSON());
      packageObj.save();
    }
  }),
  withCustomCoverage: trait({
    afterCreate(packageObj, server) {
      let customCoverage = server.create('custom-coverage');
      packageObj.update('customCoverage', customCoverage.toJSON());
    }
  }),

  afterCreate(pkg, server) {
    if (!pkg.proxy) {
      let proxy = server.create('proxy', {
        inherited: false,
        id: 'bigTestJS'
      });
      pkg.update('proxy', proxy.toJSON());
      pkg.save();
    }

    if (!pkg.visibilityData) {
      let visibilityData = server.create('visibility-data');
      pkg.update('visibilityData', visibilityData.toJSON());
      pkg.save();
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
