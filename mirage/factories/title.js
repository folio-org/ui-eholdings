import { Factory, faker, trait } from 'mirage-server';

export default Factory.extend({
  titleName: () => faker.company.catchPhrase(),
  publisherName: () => faker.company.companyName(),
  pubType: () => faker.random.arrayElement([
    'All',
    'Audiobook',
    'Book',
    'BookSeries',
    'Database',
    'Journal',
    'Newsletter',
    'Newspaper',
    'Proceedings',
    'Report',
    'StreamingAudio',
    'StreamingVideo',
    'thesisdissertation',
    'website',
    'unspecified'
  ]),

  withPackages: trait({
    afterCreate(title, server) {
      // Decide how many to create (1 to 10)
      let total = faker.random.number({ min: 1, max: 10 });

      // Decide how many will be selected (0 to total)
      let selectedCount = faker.random.number({ min: 0, max: total });

      server.createList('customer-resource', selectedCount, 'withPackage', 'withManagedCoverage', {
        title,
        isSelected: true
      });

      server.createList('customer-resource', (total - selectedCount), 'withPackage', 'withManagedCoverage', {
        title,
        isSelected: false
      });
    }
  }),

  withSubjects: trait({
    afterCreate(title, server) {
      let subjects = server.createList('subject', 3);
      title.subjects = subjects;
      title.save();
    }
  }),

  withContributors: trait({
    afterCreate(title, server) {
      let contributors = server.createList('contributor', 3);
      title.contributors = contributors;
      title.save();
    }
  }),

  withIdentifiers: trait({
    afterCreate(title, server) {
      let identifiers = server.createList('identifier', 3);
      title.identifiers = identifiers;
      title.save();
    }
  })
});
