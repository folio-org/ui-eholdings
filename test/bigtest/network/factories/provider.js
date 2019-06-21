import { Factory, faker, trait } from '@bigtest/mirage';

const helpText = '<ul><li>Enter your Gale token</li></ul>';
const defaultTags = ['urgent', 'not urgent'];

export default Factory.extend({
  name: () => faker.company.companyName(),
  packagesTotal: 0,
  packagesSelected: 0,
  tags: {
    tagList: [],
  },
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
      const proxy = server.create('proxy', {
        inherited: false,
        id: 'microstates'
      });
      provider.update('proxy', proxy.toJSON());
      provider.save();
    }
  }),

  withInheritedProxy: trait({
    afterCreate(provider, server) {
      const proxy = server.create('proxy', {
        inherited: true,
        id: 'bigTestJS'
      });
      provider.update('proxy', proxy.toJSON());
      provider.save();
    }
  }),

  withToken: trait({
    afterCreate(provider, server) {
      const token = server.create('token', {
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
      const token = server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText,
        value: 'abcdefghijk'
      });
      provider.update('providerToken', token.toJSON());
      provider.save();
    }
  }),

  withTags: trait({
    afterCreate(provider, server) {
      const tags = server.create('tags', {
        tagList: defaultTags
      });
      provider.update('tags', tags.toJSON());
      provider.save();
    }
  }),

  afterCreate(provider, server) {
    if (!provider.proxy) {
      const proxy = server.create('proxy', {
        inherited: false,
        id: 'bigTestJS'
      });
      provider.update('proxy', proxy.toJSON());
      provider.save();
    }

    if (!provider.token) {
      const token = server.create('token', {
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
