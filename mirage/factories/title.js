import { Factory, faker, trait } from 'mirage-server';

export default Factory.extend({
  titleName: () => faker.company.catchPhrase(),
  publisherName: () => faker.company.companyName(),
  pubType: () => faker.random.arrayElement([
    'Journal',
    'Newsletter',
    'Report',
    'Proceedings',
    'Website',
    'Newspaper',
    'Unspecified',
    'Book',
    'Book Series',
    'Database',
    'Thesis Dissertation',
    'Streaming Audio',
    'Streaming Video',
    'Audiobook'
  ]),

  withPackages: trait({
    afterCreate(title, server) {
      // Decide how many to create (1 to 10)
      let total = faker.random.number({ min: 1, max: 10 });

      // Decide how many will be selected (0 to total)
      let selectedCount = faker.random.number({ min: 0, max: total });

      server.createList('customer-resource', selectedCount, 'withPackage', {
        title,
        isSelected: true
      });

      server.createList('customer-resource', (total - selectedCount), 'withPackage', {
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

  withIdentifiers: trait({
    afterCreate(title, server) {
      let identifiers = server.createList('identifier', 3);
      title.identifiers = identifiers;
      title.save();
    }
  })
});
