import { Factory, faker, trait } from '@bigtest/mirage';

let helpText = '<ul><li>Enter your Gale<sup></sup> site ID in the space provided below. The site ID may contain a combination of alpha/numeric characters, varying in length. <blockquote><p> Example: The site ID immediately follows /itweb/ in a URL. The site ID in the following URL is …………….</ul>';

export default Factory.extend({
  name: () => faker.company.companyName(),
  packagesTotal: 0,
  packagesSelected: 0,

  withPackagesAndTitles: trait({
    afterCreate(provider, server) {
      // If packagesTotal is greater than zero, we'll auto-create the packages
      // for this provider here.

      if (provider.packagesTotal > 0) {
        // Decide how many will be selected if not already (0 to packagesTotal)
        provider.packagesSelected = provider.packagesSelected ||
          faker.random.number({ min: 0, max: provider.packagesTotal });

        server.createList('package', provider.packagesSelected, 'withTitles', {
          provider,
          providerName: provider.name,
          isSelected: true,
          titleCount: faker.random.number({ min: 1, max: 5 })
        });

        server.createList('package', (provider.packagesTotal - provider.packagesSelected), 'withTitles', {
          provider,
          providerName: provider.name,
          isSelected: false,
          titleCount: faker.random.number({ min: 1, max: 5 })
        });
      }
    }
  }),

  withProxy: trait({
    afterCreate(provider, server) {
      let proxy = server.create('proxy', {
        inherited: false,
        id: 'microstates'
      });
      provider.update('proxy', proxy.toJSON());
      provider.save();
    }
  }),

  withInheritedProxy: trait({
    afterCreate(provider, server) {
      let proxy = server.create('proxy', {
        inherited: true,
        id: 'bigTestJS'
      });
      provider.update('proxy', proxy.toJSON());
      provider.save();
    }
  }),

  withToken: trait({
    afterCreate(provider, server) {
      let token = server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText,
        value: ''
      });
      provider.update('providerToken', token.toJSON());
      provider.save();
    }
  }),

  withTokenAndValue: trait({
    afterCreate(provider, server) {
      let token = server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText,
        value: 'abcdefghijk'
      });
      provider.update('providerToken', token.toJSON());
      provider.save();
    }
  }),

  afterCreate(provider, server) {
    if (!provider.proxy) {
      let proxy = server.create('proxy', {
        inherited: false,
        id: 'bigTestJS'
      });
      provider.update('proxy', proxy.toJSON());
      provider.save();
    }

    if (!provider.token) {
      let token = server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText,
        value:'abcdefghijk'
      });
      provider.update('providerToken', token.toJSON());
      provider.save();
    }
  }
});
