import { Factory, faker, trait } from '@bigtest/mirage';

let helpText = '<ul><li>Enter your Gale token</li></ul>';

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
  tags: {
    tagList: [],
  },
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

  withPackageToken: trait({
    afterCreate(packageObj, server) {
      let token = server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText,
        value: ''
      });
      packageObj.update('packageToken', token.toJSON());
      packageObj.save();
    }
  }),

  withPackageTokenAndValue: trait({
    afterCreate(packageObj, server) {
      let token = server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText,
        value: 'testing package token'
      });
      packageObj.update('packageToken', token.toJSON());
      packageObj.save();
    }
  }),

  afterCreate(packageObj, server) {
    if (!packageObj.visibilityData) {
      let visibilityData = server.create('visibility-data');
      packageObj.update('visibilityData', visibilityData.toJSON());
      packageObj.save();
    }

    if (!packageObj.proxy) {
      let proxy = server.create('proxy', {
        inherited: false,
        id: 'bigTestJS'
      });
      packageObj.update('proxy', proxy.toJSON());
      packageObj.save();
    }

    if (!packageObj.token) {
      let token = server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText,
        value:'testing package token'
      });
      packageObj.update('packageToken', token.toJSON());
      packageObj.save();
    }
  }
});
