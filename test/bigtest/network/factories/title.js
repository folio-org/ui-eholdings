import { Factory, faker, trait } from '@bigtest/mirage';

export default Factory.extend({
  name: () => faker.company.catchPhrase(),
  publisherName: () => faker.company.companyName(),
  publicationType: () => faker.random.arrayElement([
    'Audiobook',
    'Book',
    'Book Series',
    'Database',
    'Journal',
    'Newsletter',
    'Newspaper',
    'Proceedings',
    'Report',
    'Streaming Audio',
    'Streaming Video',
    'Thesis & Dissertation',
    'Website',
    'Unspecified'
  ]),
  subjects: () => [],
  contributors: () => [],
  identifiers: () => [],
  isTitleCustom: false,
  isPeerReviewed: false,
  edition: '',
  description: '',
  tags: {
    tagList: [],
  },

  withPackages: trait({
    afterCreate(title, server) {
      // Decide how many to create (1 to 10)
      const total = faker.random.number({ min: 1, max: 10 });

      // Decide how many will be selected (0 to total)
      const selectedCount = faker.random.number({ min: 0, max: total });

      server.createList('resource', selectedCount, 'withPackage', 'withManagedCoverage', {
        title,
        isSelected: true
      });

      server.createList('resource', (total - selectedCount), 'withPackage', 'withManagedCoverage', {
        title,
        isSelected: false
      });
    }
  }),

  withSubjects: trait({
    afterCreate(title, server) {
      const subjects = server.createList('subject', 3);
      title.subjects = subjects.map(item => item.toJSON());
      title.save();
    }
  }),

  withContributors: trait({
    afterCreate(title, server) {
      const contributors = server.createList('contributor', 3);
      title.contributors = contributors.map(item => item.toJSON());
      title.save();
    }
  }),

  withIdentifiers: trait({
    afterCreate(title, server) {
      const identifiers = server.createList('identifier', 3);
      title.identifiers = identifiers.map(item => item.toJSON());
      title.save();
    }
  })
});
