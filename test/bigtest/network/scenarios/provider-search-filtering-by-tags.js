export default async function providerSearchFilteringByTags(server) {
  await server.createList('provider', 3, 'withPackagesAndTitles', {
    name: i => `Provider${i + 1}`,
    packagesSelected: 1,
    packagesTotal: 3
  });

  await server.create('provider', {
    name: 'Totally Awesome Co'
  });

  const allTags = ['urgent', 'not urgent'];

  const urgentTag = await server.create('tags', {
    tagList: allTags.slice(0)
  }).toJSON();

  await server.create('provider', {
    name: 'Test Urgent Tag',
    tags: urgentTag
  });

  const notUrgentTag = await server.create('tags', {
    tagList: allTags.slice(1),
  }).toJSON();

  await server.create('provider', {
    name: 'Test Not Urgent Tag',
    tags: notUrgentTag
  });

  const bothTags = await server.create('tags', {
    tagList: allTags,
  }).toJSON();

  await server.create('provider', {
    name: 'Test Both Tags',
    tags: bothTags
  });

  await server.create('provider', {
    name: 'Test No Tags'
  });
}
