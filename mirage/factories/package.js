import { Factory, faker, trait } from 'mirage-server';

export default Factory.extend({
  name: () => faker.commerce.productName(),
  titleCount: 0,
  isSelected: true,
  selectedCount: 0,
  contentType: () => faker.random.arrayElement([
    'OnlineReference',
    'AggregatedFullText',
    'AbstractAndIndex',
    'eBook',
    'eJournal'
  ]),

  withTitles: trait({
    afterCreate(packageObj, server) {
      // If titleCount is greater than zero, we'll auto-create the package titles
      // for this package here.

      if (packageObj.titleCount > 0) {
        // Decide how many will be selected (0 to titleCount)
        packageObj.selectedCount = faker.random.number({ min: 0, max: packageObj.titleCount });

        server.createList('customerResource', packageObj.selectedCount, 'withTitle', 'withManagedCoverage', {
          package: packageObj,
          isSelected: true
        });

        server.createList('customerResource', (packageObj.titleCount - packageObj.selectedCount), 'withTitle', 'withManagedCoverage', {
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

  // this trait is currently not used, by removing it we
  // can increase the code coverage of this file by 50%

  // withCustomCoverage: trait({
  //   afterCreate(packageObj, server) {
  //     let customCoverage = server.create('custom-coverage', {
  //       beginCoverage: () => faker.date.past().toISOString().substring(0, 10),
  //       endCoverage: () => faker.date.future().toISOString().substring(0, 10)
  //     });
  //     packageObj.update('customCoverage', customCoverage.toJSON());
  //   }
  // }),

  afterCreate(packageObj, server) {
    if (!packageObj.customCoverage) {
      let customCoverage = server.create('custom-coverage');
      packageObj.update('customCoverage', customCoverage.toJSON());
    }

    if (!packageObj.visibilityData) {
      let visibilityData = server.create('visibility-data');
      packageObj.update('visibilityData', visibilityData.toJSON());
    }
  }
});
