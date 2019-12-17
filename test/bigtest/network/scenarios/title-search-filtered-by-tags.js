export default async function titleSearchFilteredByTags(server) {
  const titles = await server.createList('title', 3, 'withPackages', 'withSubjects', 'withIdentifiers', {
    name: i => `Title${i + 1}`,
    publicationType: i => (i % 2 ? 'book' : 'journal'),
    publisherName: i => (i % 2 ? 'TestPublisher' : 'Default Publisher')
  });

  // make sure only one of these is not selected
  titles.forEach((title, i) => {
    title.resources.update('isSelected', !!i);
  });

  // set up subjects
  titles.forEach((title, i) => {
    if (i % 2) {
      title.subjects.push(server.create('subject',
        {
          type: 'TLI',
          subject: 'TestSubject'
        }));
      title.save();
    }
  });

  // set up identifiers
  titles.forEach((title, i) => {
    if (i % 2) {
      title.identifiers.push(server.create('identifier',
        {
          id: '999-999',
          subtype: 0,
          type: 0
        }));
      title.save();
    }
  });

  await server.create('title', {
    name: 'SomethingSomethingWhoa'
  });
  
  const allTags = ['urgent', 'not urgent'];

  const urgentTag = server.create('tags', {
    tagList: allTags.slice(0)
  }).toJSON();

  const title = server.create('title', 'withPackages', {
    name: 'Test Urgent Tag',
  });

  const taggedResource = title.resources.models[0];

  taggedResource.tags = urgentTag;
  taggedResource.save();
}
